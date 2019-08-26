'use strict'

const Env = use('Env')
const Email = use('Mail')

class Mail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return Number(Env.get('KUE_MAIL_CONCURRENCY'))
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'Mail-job'
  }

  // This is where the work is done.
  async handle ({ template, data, from, fromAlias, to, subject }) {
    console.log(`Job: ${Mail.key}`)
    try {

      await Email.send(
        [template],
        data,
        message => {
          message.to(to)
            .from(from, fromAlias)
            .subject(subject)
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Mail
