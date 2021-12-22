// Quick module hack to warn on importing both envs in one side of the app

let lock

export default function engageEnvLock(type) {
  if (lock === type) {
    throw new Error(
      `!!! Environment lock already engaged to ${lock}. Somewhere, somehow, you are importing another environment (${type}).`
    )
  }
  lock = type
}
