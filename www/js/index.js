(function (global) {
    /* ---------------------------------- Local Variables ---------------------------------- */
    var service = new UserService();
    var googleService,map ;
    service.initialize().done(function () {
        console.log("Service initialized");
    });
    /* --------------------------------- Event Registration -------------------------------- */
    // $('.search-key').on('keyup', findByName);
    // $.mobile.pageContainer = $('.page-container').pagecontainer();
    // $.mobile.pageContainer.pagecontainer('load', getCheckedURL('home.html'));
    /* ---------------------------------- Local Functions ---------------------------------- */
    function showLogin(){
      $.mobile.pageContainer.pagecontainer('change', getCheckedURL('login.html'), {
        transition: 'flow',
        reload    : true
      });
    }
    function getCheckedURL(templateName) {
      var currentPath = location.pathname;
      if(currentPath.indexOf('/templates/') != -1) {
        return templateName;
      } else {
        return 'templates/'+templateName;
      }
    }

    function getUserDates() {
        if(window.localStorage && window.localStorage.getItem('userAuth')) {
          userAuth = window.localStorage.getItem('userAuth');
          service.getUserDates(userAuth).done(function (users) {
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
              $('.user-list li a.user-item').off('click').on('click', function(e) {
                  var hrefd = $(e.target).closest("a.user-item");
                  var userId = $(hrefd).attr('user-id');
                  console.log('chosen-user-id='+ userId);
                  $.mobile.pageContainer.pagecontainer('change', getCheckedURL('user-interests.html'), {
                    transition: 'flow',
                    reload    : true,
                    userId  : userId
                  });
              });
              $('.user-list').listview('refresh');
          });
        }
    }
    function getUsers() {
        service.getAllUsers().done(function (users) {
            var l = users.length;
            var e;
            $('.user-list').empty();
            for (var i = 0; i < l; i++) {
                e = users[i].user;
                var template ='<li>'
                                + ' <h2>' + e.first_name + ' ' + e.last_name + '</h2>'
                                + '<p>'+e.email+'</p>'
                                + '<p>'+e.gender+'</p>'
                                + '<p>Interested In:'+ e.preference+'</p>'
                                + '</li>';
                $('.user-list').append(template);
            }
            $('.user-list').listview('refresh');
        });
    }
  function getUserInterests(userId) {
      if(window.localStorage && window.localStorage.getItem('userAuth')) {
        var currentUserId = window.localStorage.getItem('userAuth');
        service.getUserInterests(userId, currentUserId).done(function (userInterests) {
            $('.user-interests-collapse').empty();
            $.each(userInterests, function(key, value){
              var template ='<div class="user-interests-collapse-item" data-role="collapsible">'
                      + '<h3>'
                      + value.name
                      + '</h3>'
                      + '<p><ul class="listview" data-role="listview">';
                      $.each(value.values, function(index, item){
                        template += '<li><a href="#"';
                        if(item.is_common) {
                          template += 'class="ui-btn ui-icon-star ui-btn-icon-left"';
                        } else {
                          template += 'class="ui-btn"';
                        }
                        template += '>'
                                 + item.name
                                 +'</a></li>';
                      });      
                      template+= '</ul></p>'
                              +'<a class="impress-btn ui-shadow ui-btn ui-corner-all"'
                              + 'category-id="'+ key
                              + '" user-id="' + userId
                              +'">Impress</a></div>';
              $('.user-interests-collapse').append(template);
            });
            $('.user-interests-collapse-item a.impress-btn').off('click').on('click', function(e) {
                var categoryId = $(e.target).attr('category-id');
                var userId = $(e.target).attr('user-id');
                console.log('chosen-category-id='+ categoryId);
                $.mobile.pageContainer.pagecontainer('change', getCheckedURL('impress.html'), {
                  transition: 'flow',
                  reload    : true,
                  categoryId  : categoryId,
                  userId : userId
                });
            });
            $('.user-interests-collapse-item.listview').listview('refresh');
            $(".user-interests-collapse").trigger("create");
        });
      }
    }
  function showLogoutModal(){
    $.mobile.pageContainer.pagecontainer('change', getCheckedURL('logout.html'), {
      transition: 'flow',
      reload    : true
    });
  }
  function logoutUser() {
    $('.ui-btn.ui-corner-all.logout-ok-btn').off('click').on('click', function() {
      if(window.localStorage){
          window.localStorage.removeItem('userAuth');
          $.mobile.pageContainer.pagecontainer('change', getCheckedURL('home.html'), {
            transition: 'flow',
            reload    : true
          });
      }
    });
  }
function initLogin(){
  $('.ui-shadow.ui-btn.ui-corner-all.login-submit-btn').off('click').on('click', function(e){
    var userCreds = {};
    $('form[name=login-form]').serializeArray().map(function(item){
      userCreds[item.name] = item.value;
    });
    console.log(userCreds);
    service.loginUser(userCreds).done(function(response){
        if(response.success) {
          // save in local storage and redirect to home
          if(window.localStorage) {
            window.localStorage.setItem('userAuth', response.item.user.id);
            $.mobile.pageContainer.pagecontainer('change', getCheckedURL('home.html'), {
              transition: 'flow',
              reload    : true
            });
          }
        } else {
          // show error
          alert(response.msg);
        }
    });
  });
}
function initHome() {
  $('.ui-btn.ui-corner-all.user-list-btn').off('click').on('click', function() {
    $.mobile.pageContainer.pagecontainer('change',  getCheckedURL('list-users.html'), {
      transition: 'flow',
      reload    : true
    });
  });

  // if logged in show log out
  var isLoggedIn = window.localStorage.getItem('userAuth') && true;
  if(isLoggedIn) {
    $('.ui-btn.ui-corner-all.login-btn').hide();
    $('.ui-btn.ui-corner-all.logout-btn').show();
    $('.ui-btn.ui-corner-all.logout-btn').off('click').on('click', function() {
      showLogoutModal();
    });
  } else {
    $('.ui-btn.ui-corner-all.login-btn').show();
    $('.ui-btn.ui-corner-all.logout-btn').hide();
    $('.ui-btn.ui-corner-all.login-btn').off('click').on('click', function() {
      showLogin();
    });
  }
  $('.ui-btn.ui-corner-all.date-list-btn').off('click').on('click', function() {
    var isLoggedIn = false;
    if(window.localStorage) {
      isLoggedIn = window.localStorage.getItem('userAuth') && true;
    }
    if(!isLoggedIn) {
        showLogin();
        return;
    }
    $.mobile.pageContainer.pagecontainer('change', getCheckedURL('date-list.html'), {
      transition: 'flow',
      reload    : true
    })
  });
}
function getImpressData(userId, categoryId) {
  if(window.localStorage) {
    var userAuth = window.localStorage.getItem('userAuth');
    service.getImpressData(userAuth, userId, categoryId).done(function(response){
      if(response.success) {
        // initialize map
        var mapContainer = $('#impress-date .ui-content .map-container')[0];
        console.log(response);
        var myLocation = {lat: response.logged_user.user.home_latitude, lng: response.logged_user.user.home_longitude};
        var partnerLocation = {lat: response.partner.user.home_latitude , lng: response.partner.user.home_longitude };
        var partnerName = response.partner.user.first_name + ' ' + response.partner.user.last_name;
        $('#map-tab .map-tab-desc .map-place-type').html(response.centre.interested_places);
        $('#map-tab .map-tab-desc .partner-name').html(partnerName);
        initMap(mapContainer, response.centre, myLocation, partnerLocation, partnerName);
      }
    });
  }

}
$(document ).on( "pagebeforechange" , function ( event, data ) {
    if ( data.toPage[0].id == "home" ) {
        initHome();
        return;
    }
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
    if ( data.toPage[0].id == "dates-list" ) {
        getUserDates();
        return;
    }
    if ( data.toPage[0].id == "users-logout" ) {
        logoutUser();
        return;
    }
    if( data.toPage[0].id == "users-login"){
        initLogin();
        return;
    }
    if ( data.toPage[0].id == "impress-date"   ) {
        $("#impress-date .ui-content").enhanceWithin();
        // call server to get data
        var userId = data.options.userId;
        var categoryId = data.options.categoryId;
        getImpressData(userId, categoryId);
        return;
    }
});
})(window);
