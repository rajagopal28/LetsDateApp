/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();*/
// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope

$(document).on("pageinit", "#settings", function(e) {
      $(':mobile-pagecontainer').pagecontainer('load','templates/list-users.html');
      getUsers();
});
(function () {
    /* ---------------------------------- Local Variables ---------------------------------- */
    var service = new UserService();
    service.initialize().done(function () {
        console.log("Service initialized");
    });

    /* --------------------------------- Event Registration -------------------------------- */
    // $('.search-key').on('keyup', findByName);
    $('.ui-btn.ui-corner-all.user-list-btn').on('click', function() {
      $.mobile.pageContainer.pagecontainer('change', 'templates/list-users.html', {
        transition: 'flow',
        reload    : true
      });
    });

    /* ---------------------------------- Local Functions ---------------------------------- */
    function getUsers() {
        service.findAll().done(function (users) {
            var l = users.length;
            var e;
            $('.user-list').empty();
            for (var i = 0; i < l; i++) {
                e = users[i].user;
                var template ='<li><a class="user-item" user-id="'
                                + e.id
                                + '" href="#">'
                                + ' <h2>' + e.first_name + ' ' + e.last_name + '</h2>'
                                + '<p>'+e.email+'</p>'
                                + '<p>'+e.gender+'</p>'
                                + '<p>Interested In:'+ e.preference+'</p>'
                                + '</a></li>';
                $('.user-list').append(template);
            }
            $('.user-list li a.user-item').on('click', function(e) {
                var hrefd = $(e.target).closest("a.user-item");
                var userId = $(hrefd).attr('user-id');
                console.log('chosen-user-id='+ userId);
                $.mobile.pageContainer.pagecontainer('change', 'user-interests.html', {
                  transition: 'flow',
                  reload    : true,
                  userId  : userId
                });
            });
            $('.user-list').listview('refresh');
        });
    }
    function getUserInterests(userId) {
        service.getUserInterests(userId).done(function (userInterests) {
            $('.user-interests-collapse').empty();
            $.each(userInterests, function(key, value){
              var template ='<div class="user-interests-collapse-item" data-role="collapsible">'
                      + '<h3>'
                      + value.name
                      + '</h3>'
                      + '<p><ul class="listview" data-role="listview">';
                      $.each(value.value, function(index, item){
                        template += '<li>'+item+'</li>';
                      });      
                      template+= '</ul></p></div>';
              $('.user-interests-collapse').append(template);
            });
            $('.user-interests-collapse-item.listview').listview('refresh');
            $(".user-interests-collapse").trigger("create");
        });
    }
    $(document ).on( "pagebeforechange" , function ( event, data ) {
        if ( data.toPage[0].id == "interests-list" ) {
            var userId = data.options.userId;
            console.log(userId);
            getUserInterests(userId);
            return;
        }
        if ( data.toPage[0].id == "users-list" ) {
            getUsers();
            return;
        }
    });
}());
