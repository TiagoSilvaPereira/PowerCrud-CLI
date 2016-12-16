/**
 * Load modules for application
 */

angular
    
.module('{%angularAppName%}', [
	    'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'ngFileUpload',
        '{%angularAppName%}.services'
])

.run(function(){
    //Actions when App runs
})

.constant('CONFIG', 
{
	DebugMode: true,
	StepCounter: 0,
	APIHost: 'http://localhost:5000',
    APIVersion: 'v1',
    APIAddress: 'http://localhost:5000/v1',
    ResourcesAddress: 'http://localhost:5001',
    UploadAddress: 'http://localhost:5001/uploads'
}); 
