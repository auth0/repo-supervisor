import config from './../../config/main.json';

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
    setFailure: (msg, url) => setStatus('failure', msg, url),
    setPending: (msg, url) => setStatus('pending', msg, url),
    setSuccess: (msg, url) => setStatus('success', msg, url)
  };
};
