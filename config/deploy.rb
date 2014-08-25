require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
# require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)
# require 'mina/rvm'    # for rvm support. (http://rvm.io)

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :domain, '178.62.0.131'
set :deploy_to, '/var/www/ashsmith'
set :repository, 'https://github.com/ashsmith/ashsmithio.git'
set :branch, 'master'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
# set :shared_paths, ['config/database.yml', 'log']

# Optional settings:
  set :user, 'www-data'    # Username in the server to SSH to.
#   set :port, '30000'     # SSH port number.

task :environment do
  # invoke :'rvm:use[ruby-1.9.3-p194@nayr]'
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'bundle:install'
    queue "#{bundle_prefix} jekyll build"
  end
end

