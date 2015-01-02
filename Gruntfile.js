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

		sftp: {
			deploy: {
				files: {
					'./': '_site/**'
				},
				options: {
					path: '/bakirimmobilien_neu/',

					srcBasePath: '_site/',

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
	grunt.option('config', 'production');
	grunt.registerTask('deploy', ['sftp:deploy', 'sshexec:moveToNew']);
	grunt.registerTask('backup', ['sshexec:backup']);
}
