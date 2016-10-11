module.exports = function(grunt) {
	grunt.initConfig({
		secret: grunt.file.readJSON('deploy_credentials.json'),

		clean: {
			build: {
				src: '_site/'
			}
		},

		exec: {
			jekyllServe: { cmd: 'bundle exec jekyll s' },
			jekyllBuild: { cmd: 'bundle exec jekyll b' }
		},

		sshconfig: {
			production: {
				host:     '<%= secret.host %>',
				port:     '<%= secret.port %>',
				username: '<%= secret.username %>',
				password: '<%= secret.password %>',
				deployTo: '<%= secret.deployTo %>'
			}
		},

		syncdeploy: {
			main: {
				cwd: '_site/',
				src: ['**/*', '**/.htaccess']
			},
			options: {
				removeEmpty: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-sync-deploy');

	grunt.option('config', 'production');

	grunt.registerTask('default', ['clean', 'exec:jekyllServe']);
	grunt.registerTask('deploy', ['clean', 'exec:jekyllBuild', 'syncdeploy']);
};
