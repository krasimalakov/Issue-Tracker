'use strict';

app.controller('ProjectController.AddProject', [
    '$scope',
    '$location',
    'notifyService',
    'userService',
    'labelService',
    'projectService',
    function ($scope, $location, notifyService, userService, labelService, projectService) {
        userService.denyNotloggedUser();

        userService.getAllUsers().then(function (users) {
            $scope.users = users;
        }, function (error) {
            notifyService.showError('Get all users request failed !', error);
        });

        labelService.getLabels('').then(function (labels) {
            $scope.labels = labels;
        }, function (error) {
            notifyService.showError('Get all labels request failed !', error);
        });

        $scope.addProject = function (project) {
            if (project.labels != undefined) {
                var labels = project.labels.split(/\s*,\s*/);
                project.labels = [];
                labels.forEach(function (label) {
                    project.labels.push({Name: label})
                });
            }
            if (project.priorities != undefined) {
                var priorities = project.priorities.split(/\s*,\s*/);
                project.priorities = [];
                priorities.forEach(function (priority) {
                    project.priorities.push({Name: priority})
                });
            } else {
                project.priorities = [];
            }
            // if (project.LeadId == undefined) {
            //     project.LeadId='';
            // }
            console.log(project);
            projectService.addProject(project).then(function (result) {
                console.log(project);

                notifyService.showInfo('Project is added successfully !');
                $location.path('/');
            }, function (error) {
                notifyService.showError('Add project failed !', error);
            })
        };
    }]);