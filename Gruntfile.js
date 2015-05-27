module.exports = function(grunt) {
	grunt.initConfig({
		secret: grunt.file.readJSON('deploy_credentials.json'),

		sshconfig: {
			production: {
				host: '<%= secret.host %>',
				username: '<%= secret.username %>',
				password: '<%= secret.password %>'
			}
		},

		clean: {
			build: {
				src: '_site/'
			}
		},

		exec: {
			jekyllServe: { cmd: 'bundle exec jekyll s' },
			jekyllBuild: { cmd: 'bundle exec jekyll b' }
		},

		sftp: {
			deploy: {
				files: [
					{
						src: ['_site/**/*', '!_site/**/.DS_Store'],
						dot: true
					}
				],
				options: {
					srcBasePath: '_site/',
					path: '/bakirimmobilien_neu/',
					showProgress: true,
					createDirectories: true
				}
			}
		},

		sshexec: {
			moveToNew: {
				command: 'rm -R bakirimmobilien && mv bakirimmobilien_neu bakirimmobilien'
			},
			backup: {
				command: 'cp bakirimmobilien bakirimmobilien_backup_' + grunt.template.today('yyyy_mm_dd')
			}
		}
	});

	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-exec');

	grunt.option('config', 'production');

	grunt.registerTask('default', ['clean', 'exec:jekyllServe']);
	grunt.registerTask('deploy', ['clean', 'exec:jekyllBuild', 'sftp:deploy', 'sshexec:moveToNew']);
	grunt.registerTask('backup', ['sshexec:backup']);
}
