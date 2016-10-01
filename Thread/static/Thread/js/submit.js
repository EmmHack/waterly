/*
 * Runek
 * http://www.scoopthemes.com/
 *
 * Copyright (c) 2014, ScoopThemes
 * Licensed under the BSD license.
 */

$(document).ready(function() {
    
    $(document).on('submit', '#meterForm', function()
    {
        $('#meterView').hide(100);
        $('#otpView').show(1000);
        /*
        var data = $(this).serialize();
            $.ajax({
            type : 'POST',
            url  : 'mail/contact_me.php',
            data : data,
            success :  function(data){
                if (data === "1" ){
                }else{
                }
            }
        }); */
            return false;
        });
      
      $(document).on('submit', '#otpForm', function()
      {
        $('#otpView').hide(100);
        $('#passwordView').show(1000);
        /*
        var data = $(this).serialize();
            $.ajax({
            type : 'POST',
            url  : 'mail/contact_me.php',
            data : data,
            success :  function(data){
                if (data === "1" ){
                }else{
                }
            }
        }); */
            return false;
        });
        
        $(document).on('submit', '#passwordForm', function()
        {
            window.location.href = "index.html";
        /*
        var data = $(this).serialize();
            $.ajax({
            type : 'POST',
            url  : 'mail/contact_me.php',
            data : data,
            success :  function(data){
                if (data === "1" ){
                }else{
                }
            }
        }); */
            return false;
        });
        
        $(document).on('submit', '#loginForm', function()
        {
            window.location.href = "index.html";
        /*
        var data = $(this).serialize();
            $.ajax({
            type : 'POST',
            url  : 'mail/contact_me.php',
            data : data,
            success :  function(data){
                if (data === "1" ){
                }else{
                }
            }
        }); */
            return false;
        });
});