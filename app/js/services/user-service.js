'use strict';

app.factory('userService', [
    '$http',
    '$q',
    'BASE_URL',
    function ($http, $q, baseUrl) {
        function login(user) {
            var deferred = $q.defer(),
                data= "grant_type=password&username=" + user.username + "&password=" + user.password;
            $http.defaults.headers.ContentType = 'application/x-www-form-urlencoded';
            $http.post(baseUrl + 'Token', data).then(function (response) {
                    sessionStorage['currentUser'] = JSON.stringify(response.data);
                    deferred.resolve(response.data);
                }, function (error) {
                    deferred.reject(error.data);
                });
            return deferred.promise;
        }

        function register(userData) {
            var deferred = $q.defer();
            $http.post(baseUrl + 'Account/Register', userData).then(function (response) {
                sessionStorage['currentUser'] = JSON.stringify(response.data);
                deferred.resolve(response.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error.data);
            });
            return deferred.promise;
        }

        function logout() {
            delete sessionStorage['currentUser'];
            delete sessionStorage['isAdmin'];
        }

        function setAdminPermission(permission) {
            sessionStorage['isAdmin'] = permission;
            // todo: change to functionality from user profile
        }

        function isAdmin() {
            return sessionStorage['isAdmin'];
        }

        function isLogged() {
            return sessionStorage['currentUser'] != undefined;
        }

        function getCurrentUser() {
            return JSON.parse(sessionStorage['currentUser']);
        }

        function setAuthorizationHeaders() {
            var currentUser = getCurrentUser();
            if (currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + currentUser.access_token;
                $http.defaults.headers.common['Accept'] = 'application/json;odata=verbose';
            }
        }

        function getProfile() {
            setAuthorizationHeaders();
            var deferred = $q.defer();
            $http.get(baseUrl + 'users/me').then(function (response) {
                console.log(response);
                // todo: fix Url
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        }

        function editProfile(userData) {
            setAuthorizationHeaders();
            var deferred = $q.defer();
            $http.put(baseUrl + 'me', userData).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        }

        function changePassword(userData) {
            setAuthorizationHeaders();
            var deferred = $q.defer();
            $http.post(baseUrl + 'Account/ChangePassword', userData).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        }

        function getAllUsers() {
            setAuthorizationHeaders();
            var deferred = $q.defer();
            // todo: change to get all users
            $http.get(baseUrl + 'users/').then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        }

        return {
            login: login,
            register: register,
            logout: logout,
            setAdminPermission: setAdminPermission,
            isAdmin: isAdmin,
            isLogged: isLogged,
            getProfile: getProfile,
            editProfile: editProfile,
            changePassword: changePassword,
            getAllUsers: getAllUsers
        }
    }]);