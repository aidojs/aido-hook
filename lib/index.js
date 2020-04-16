const { set } = require('lodash')

/**
 * Plugin factory
 * @param {Object}   koa
 * @param {Object}   koa.app          - the Koa application
 * @param {Object}   koa.router       - the Koa router
 * @param {Object}   utils            - utils exposed to the plugin
 * @param {Object}   utils.middleware - useful middleware from the Aido library
 */
function pluginFactory(koa, { middleware }) {
  /**
   * Initializes the plugin : adds the hook route
   */
  async function initPlugin() {
    const { initSlash } = middleware
    // This route is used to request an action from outside of the Aido application
    koa.router.post(
      'hook',
      '/hook',
      async (ctx, next) => {
        if (ctx.options.aidoHookVerificationToken) {
          const { token } = ctx.request.body
          ctx.assert(token === ctx.options.aidoHookVerificationToken, 500, 'Verification token invalid')
        }
        await next()
      },
      // Identify slash command and arguments
      async (ctx, next) => {
        const { command, text, action, args, conversationWith = [], conversationAs = 'user', sessionId = '' } = ctx.request.body
        set(ctx, 'trigger.slash', command.replace(/\//g, ''))
        set(ctx, 'trigger.text', text)
        set(ctx, 'trigger.action', action)
        set(ctx, 'trigger.args', args)
        set(ctx, 'trigger.channel', null)
        set(ctx, 'trigger.conversationWith', conversationWith)
        set(ctx, 'trigger.conversationAs', conversationAs)
        set(ctx, 'trigger.sessionId', sessionId)
        await next()
      },
      initSlash,
      // Get user's ID from payload
      async (ctx, next) => {
        const slackId = ctx.request.body.userId
        await next()
        // Once the request has been responded to, load the user profile & session
        await ctx.slash.setUser(slackId)
      },
      // Send response to the hook
      async (ctx) => {
        ctx.body =JSON.stringify(ctx.trigger)
      }
    )
  }

  return {
    name: 'hook',
    initPlugin,
  }
}

module.exports = pluginFactory
