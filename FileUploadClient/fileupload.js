angular.module('FileUploadModule', ['ngMaterial'])
    .controller('FileUploadCtrl', function($scope) {
        $scope.init = () => {
            $scope.serviceURL = "http://localhost:5000/api/file/upload";
        }
    })
    .service('serviceFileUpload', ['$http', function serviceFileUpload($http){
        this.uploadFileToServer = (serviceURL, file, fileChunkSize, onSuccess, onError) =>
            this.uploadFileChunkToServer(serviceURL, file, fileChunkSize, 0, onSuccess, onError)

        this.uploadFileChunkToServer = (serviceURL, file, chunkSize, chunkIndex, onSuccess, onError) =>
        {
            var self = this;
            let offset = chunkIndex * chunkSize;
            let actualChunkSize = Math.min(chunkSize, file.size - offset);
            if(actualChunkSize <= 0)
                return;
            let chunk = file.slice(offset, offset + actualChunkSize);
            var formData = new FormData();
            formData.append('chunk', chunk, file.name);
            formData.append('index', chunkIndex);
            $http({ method: 'POST', url: serviceURL, data: formData,
                headers: {'Content-Type': undefined}
            })
            .then(function successCallback(response) {
                onSuccess(`${offset+response.data} of ${file.size} uploaded.`);
                self.uploadFileChunkToServer(serviceURL, file, chunkSize, chunkIndex + 1, onSuccess, onError);
            }, function errorCallback(response) {
                onError(response);
            });
        }
    }])
    .directive('directiveSelectFile', selectFile)
    .directive('directiveUploadFile', uploadFile);

    function selectFile() {
        let directive = {
            restrict: 'E',
            template: `<input id="fileInput" type="file" class="ng-hide">
                        <md-input-container md-no-float>    
                            <label>File to Upload</label>  
                            <input id="textInput" ng-model="fileName" type="text" ng-readonly="true" style="width:200px;">
                            <br/><small><span ng-show="fileName">{{file.size}} bytes</span></small>
                        </md-input-container>
                        <md-button id="selectButton" class="md-primary">Select file</md-button>`,
            link: selectFileLink
        };
        return directive;
    }

    function selectFileLink(scope, element, attrs) {
        let input = $(element[0].querySelector('#fileInput'));
        let button = $(element[0].querySelector('#selectButton'));
        let textInput = $(element[0].querySelector('#textInput'));

        if (input.length && button.length && textInput.length) {
                button.click(function(e) {
                    input.click();
            });
            textInput.click(function(e) {
                input.click();
            });
        }

        input.on('change', function(e) {
            var files = e.target.files;
            scope.file = files[0];
            scope.fileName = scope.file ? scope.file.name : null;
            scope.$apply();
        });   
    }

    function uploadFile() {
        let directive = {
            restrict: 'E',
            template: `<md-input-container md-no-float>
                            <label>File Service URL</label>
                            <input type="url" id="serviecURLInput" ng-model="serviceURL" type="text" style="width:300px;">
                        </md-input-container>
                        <md-input-container style="margin-right: 10px;">                
                            <label>File Chunk Size</label>
                            <md-select ng-disabled="!fileName" ng-model="chunkSize" style="width:150px;">
                                <md-option ng-repeat="size in fileChunkSizes" ng-value="size">{{size}}</md-option>
                            </md-select>
                        </md-input-container>
                        <md-button id="uploadButton" ng-disabled="!fileName||!chunkSize" class="md-primary" ng-click="uploadFile()">Upload file</md-button>`,
            controller: function($scope, serviceFileUpload) {
                $scope.fileChunkSizes = [1000, 2000, 5000, 10000, 20000, 100000];
                $scope.chunkSize = $scope.fileChunkSizes[0];
                
                $scope.uploadFile = function() {
                    $scope.errorMessage = null;
                    $scope.progress = null;
                    serviceFileUpload.uploadFileToServer($scope.serviceURL, $scope.file, $scope.chunkSize, $scope.onFileChunckUploaded, $scope.onFileChunkUploadFailed);
                }

                $scope.onFileChunckUploaded = (data) => {
                    $scope.progress = data;
                };
        
                $scope.onFileChunkUploadFailed = (response) => {
                    $scope.errorMessage = "Uploading failed.";
                };
            }  
        };
        return directive;
    }
   