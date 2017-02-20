const config = require('../../config/main.json');

module.exports = (service, options) => {
  const setStatus = (state, description, url) => service.repos.createStatus({
    state,
    target_url: url || '',
    description,
    context: config.name,
    repo: options.repo,
    owner: options.user,
    sha: options.sha
  });

  return {
    setError: (msg, url) => setStatus('error', msg, url),
    setFailure: msg => setStatus('failure', msg),
    setPending: msg => setStatus('pending', msg),
    setSuccess: msg => setStatus('success', msg)
  };
};
