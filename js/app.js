// Helper to check card type
Handlebars.registerHelper('isMagicOrTrap', function (value) {
  return (value === 'Spell Card' || value === 'Trap Card') ? false : true;
});


// Show ajax request progress
$(document).on("ajaxStart", function (){
  $(".loading").show();
}).on("ajaxStop", function(){
  $(".loading").hide();
});

// Function to get ajax data
var makeRequest = function(cardName) {

  if ( cardName.length === 0 ) {
    $('input[type="text"]').css('border', '1px solid red');
    $('#helpId').text('Ingresa un nombre de carta por favor!');
  } else {
    // Clean fields if has errors
    $('input[type="text"]').css('background-color', 'white');
    $('input[type="text"]').css('border', '1px solid #ccc');

    // Promises ajax
    $.ajax({
      type: "GET",
      url: "https://db.ygoprodeck.com/api/v7/cardinfo.php",
      data: { name: cardName},
      dataType: "JSON",
    }).done(function(answer){
      // Assign shortcut data ajax
      var answer = answer.data;
      $('#helpId').text('');
        // Create template handlebar
        var template = Handlebars.compile($('#card_info-template').html());
        // Create and fill object to send template
        var datos = {
          id: answer[0].id,
          atk: answer[0].atk,
          def: answer[0].def,
          img: answer[0].card_images[0].image_url,
          name: answer[0].name,
          type: answer[0].type,
          desc: answer[0].desc,
          prices: answer[0].card_prices[0]
        };
        // Remove previous card from DOM
        $('.card-container').children().remove();
        // append new card to DOM
        $('.card-container').append(template(datos));
    }).fail(function( xhr, status, errorThrown ) {
      $('#helpId').text('La carta no se encuentra en la base de datos');
      console.log(`Error: ${errorThrown}`);
      console.log(`Status: ${status}`);
      console.log(xhr);
    });
  }
}

$('form').bind('submit', function(e){
  e.preventDefault();
  
  makeRequest( $('#card-name').val() );

});

