$(document).ready(function (event) {
    $(".registration-successful").hide();


    console.log("Am clientJS getting called");



    $('.signUp').click(function () {
        console.log("Am i getting called In SignUp");
        $('.section-inner').empty();
        $('.section-inner').load('signup.html');
    });

    $('.login').click(function () {
        console.log("Am i getting called In Login");
        $('.section-inner').empty();
        $('.section-inner').load('login.html');
    });

});
/*$("#form-registration").validate({
      rules:{
        username:{
          required:true,
          minlength:6
        },
        email:{
                required:true,
          email:true
        },
        password:{
          required:true,
          minlength:6
        },
        confpassword:{
          required:true,
          minlength:6,
          equalTo:"#password"
        }
      },
      messages:{
        username:{
          required:"Please enter your username",
          minlength:"Your name must consist of 6 characters"
        },
        password:{
          required:"Please enter your password",
          minlength:"Your password must consist of 6 characters"
        },
        confpassword:{
          required:"Please enter your password",
          minlength:"Your password must consist of 6 characters",
          equalTo:"Please enter the same password as above"
        }
      },
      errorPlacement: function( error, element ) {
        $( "<br>" ).appendTo( element.parent().find( "label" ) );
        error.appendTo( element.parent().find( "label" ) );
      }

    }); */


    $(".form-search").submit(function (event) {
        event.preventDefault();
        console.log("Am Login formsearch getting called called");
        var zipcode = $("#inputsearch").val();
        // var dropDownSearch = $("#dropdownsearch").val();

        console.log("Zip Code" + zipcode);

        var pagePath = window.location.pathname;
        console.log("Page Path" + pagePath);
        


        /*marius api call*/
        var params = {
           // username: 'user3',
           // password: 'user3',
            zipcode: zipcode
        };
        var dresult = $.ajax({
                /* update API end point */
                url: '/profile/search/',
                zipcode: zipcode,
                cache: false,
                dataType: "json",
                /*set the call type GET / POST*/
                type: "POST"
            })
            /* if the call is successful (status 200 OK) show results */
            .done(function (dresult) {
                /* if the results are meeningful, we can just console.log them */


                if (dresult.redirectTo && dresult.msg == 'Just go there please') {
                    jQuery.support.cors = true;
                    // $('.table-responsive').append(dresult);
                    // window.location = '/';

                    var trHTML = '';
                    //  $.each(dresult.items, function (i, item) {
                    trHTML += '<tr><td>' + dresult.items.email + '</td><td>' + dresult.items.zipcode + '</td></tr>';
                    // });
                    $('.section2').hide();
                    $('#table').append(trHTML);

                    window.location.href = "/";
                    console.log(dresult.email);
                }
                /* if the results are not meeningful, it might help to convert them to string first
                    var displayStringifiedResults = JSON.stringify(result);
                    console.log(displayStringifiedResults);*/
            })
            /* if the call is NOT successful show errors */
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
  });

        /*previous code*/
        /*  $.ajax({
              url: '/search',
              cache: false,
              type: 'POST',
              username: 'user3',
              password: 'user3',
              data: JSON.stringify({
                  zipcode: zipcode
              }),
              xhrFields: {
                  withCredentials: true
              },
              contentType: "application/json",*/
        //beforeSend: function (req) {
        //    req.setRequestHeader('Authorization', auth);
        //}
        /*  success: function (response) {
                console.log(response);
                if (response.redirectTo && response.msg == 'Just go there please') {
                    window.location = '/';
                }
                console.log(response);
            },
            failure: function (response) {
                console.log("fail" + textStatus);
            }
        }); */

        /*  request.success(function (response) {
              if (response.redirectTo && response.msg == 'Just go there please') {
                  window.location = '/';
              }
              console.log(response);
              if (response === 'data')
                  console.log("success");
          }); */

        /*request.error(function (httpObj, textStatus) {
            if (httpObj.status == 200)
                console.log("success");
            else
                console.log("fail" + textStatus);
        }); */


  



$("#form-registration").submit(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();


    //get the value from the input box
    var user = $("#name").val();
    var email = $("#email").val();
    var pass = $("#password").val();
    var confpassword = $("#confpassword").val();
    console.log("All data captured in AJAX" + user + "," + email + "," + password);
    $.post("/register", {
        name: user,
        email: email,
        password: pass,
        confpassword: confpassword
    }, function (data) {
        console.log(data);
        if (data === 'done') {
            $('.section-inner').empty();
           // $(".registration-successful").show();
            
            $('.section-inner').load('login.html');
            //alert("login success");
        }
    });
});

$("#form-login").submit(function (event) {
    console.log("All data captured from Login Page");
    event.preventDefault();
    var username = $("#username").val();
    var pass = $("#password").val();


    $.ajax({
        url: '/login',
        cache: false,
        type: 'POST',
        data: {
            username: username,
            password: pass
        },
        dataType: 'json',
        success: function (response) {
            if (response.redirectTo && response.msg == 'Just go there please') {
                window.location = '/profile';
            }
            console.log("success");
        }
    });

});


/* $.post("/login", {
     email: email,
     password: pass
 }, function (response) {
     console.log(response);
     if (response.retStatus === 'Success') {
         console.log(response);
         if (response.redirectTo && response.msg == 'Just go there please') {
             window.location = '/profile';
         }
         console.log("login success");
     } else {
         console.log("Failed to login");
         window.location = '/';
     }
 });*/

//  var data={email:email,password: pass};
/* console.log("All data captured in Login Page" +  "," + email + "," + pass);
 $.ajax({
   url:'/login',
   type: 'POST',
   data: {emaillogin:escape(email),passwordlogin: pass},
   dataType : 'json',

   success:function(data){
     console.log('success');
     console.log(JSON.stringify(data));
   }
 }); */

/*$.post("/login",{email:email,password: pass}, function(data){
     console.log(data);
     if(data==='done')
       {
         // $('.section-inner').empty();
         //$(".registration-successful").show();
         console.log("login success");
       }
   }); */
