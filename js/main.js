/*---------- FUNCTIONS ----------*/   
var maxSearches;
var imageSearch;  //Google API object
var allResults;   //Google search results objects
var allImages;    //Image objects
var index;
var queries;
// var delimiters = ['wiki', '!', '?', '_', '|', '»', '-', '(', ',', ':', '.', ' '];
// var delimiters = ['wiki', '!', '?', '_', '|', '»', '-', '(', ',', ':', '.'];  
var delimiters = ['-', '!', '?', '_', '|', '»', '(', ',', ';', '.', 'wiki'];
  // var delimiters = ['!', '?', '.', '-'];

// 2: Load the Google search module
// module: search; version: 1
google.load('search', '1');
  
// 3: Assign the OnLoad function as the callback for the Google search module
//google.setOnLoadCallback(OnLoad);

$('#okButton').click(function(){
  var query = $('#searchBox').val();
  console.log('Calling function: ' + query);
  
  // Clears results div
  $('#firstImage').html('');
  $('#content').html('');
  $('#lastImage').html('');
  maxSearches = 5;
  queries = [];
  allResults = [];
  allImages = [];
  index = 0;

  OnLoad(query);
});

// 4: Search parameters
function OnLoad(str) {

  // Create an Image Search instance.
  imageSearch = new google.search.ImageSearch();

  imageSearch.setResultSetSize(8);

  // Set searchComplete as the callback function when a search is 
  // complete.  The imageSearch object will have results in it.
  // imageSearch.setSearchCompleteCallback(this, searchComplete, null);
  imageSearch.setSearchCompleteCallback(this, createArray, null);
  
  newSearch(str);
}  

// 5: Executes the search
function newSearch(str){
  imageSearch.execute(str);
  console.log("Calling new search");
}       


// 6: Storing each result in a single array
function createArray(){

  if (imageSearch.results && imageSearch.results.length > 0) {
    // allResults = []; //cleaning the array  

    allResults.push(imageSearch.results[0]);

    var imageObj = new Image();
    imageObj.src = imageSearch.results[0].tbUrl;     
    allImages.push(imageObj);

    console.log(allResults.length);
    searchComplete();

  //no more results found!
  }else{
    var result = imageSearch.results[0];
    displayAll();
  }
}   

// 7: Displaying the results
function searchComplete() {
  // console.log(imageSearch.results);
  console.log('*****************************************************');

  if(index == maxSearches){
    displayAll();
  }
  
  var result = imageSearch.results[0];

  var query = sliceString(result.titleNoFormatting);

  //Verifying next image title
  for(imageIndex = 0; imageIndex < imageSearch.results.length; imageIndex++){
    console.log('image index: ' + imageIndex + '/' + imageSearch.results.length);  

    // Using content instead of title definitely prevents from ending up in dead ends...
    var originalContent = imageSearch.results[imageIndex].contentNoFormatting;
    var originalTitle = imageSearch.results[imageIndex].titleNoFormatting;
    console.log('Original original title: ' + originalTitle);
    var newQuery = sliceString(originalTitle);
    console.log('Checking query: ' + newQuery);

    if(isStored(newQuery) || isNumeric(newQuery)){
      console.log('Content already stored.');

      //Last resource!!!
      if(imageIndex == imageSearch.results.length - 1 && index < maxSearches){
        // newQuery = originalTitle.substr(0, originalTitle.indexOf(' '));
        newQuery = sliceString(originalContent);
        index++;
        newSearch(newQuery);
      }
    }else{
      console.log('New query: ' + newQuery);
      queries.push(newQuery);
      console.log(queries);
      if(index < maxSearches){
        console.log('--------------------------------' + index);
        index++;
        newSearch(newQuery);
      }                
      break
    }
  }
}

function displayAll(){
  setup();
}

function displayThumb(result){
  // console.log('display thumb');
  
  // // For each result write it's title and image to the screen
  // var title = result.titleNoFormatting;
  // var content = result.contentNoFormatting;
  // var divId = index;

  // var newDiv = '<div id="' + divId + '" class="results">';
  // newDiv += '<b> >> </b>';    
  // newDiv += '<img src="' + result.tbUrl + '" class="thumb"/>';
  // // newDiv += '<img src="' + result.url + '" class="thumb"/></div>';  
  // newDiv = $.parseHTML(newDiv);
  
  // $('#content').append(newDiv);  

  // $('#' + divId).click(function(){
  //   displayLarge(allResults[this.id], '#lastImage');
  //   // console.log(allResults);
  // });  
}

/*---------- AUX FUNCTIONS ----------*/
var sliceString = function(str){

  var dec = decodeURI(str);
  var decHtml = '<p>' + dec + '</p>';
  dec = $.parseHTML(decHtml);
  dec = $(dec).text();
  str = dec;  
  str = str.toLowerCase();
  console.log('lower case: ' + str);
  // if(str.indexOf('file') != -1){
  //   str = str.replace('file', '');
  // }

  var delimiterIndex = -1;
  var newString = str;

  if(str.indexOf(':') != -1){
    newString = newString.substring(newString.indexOf(':') + 2, newString.length);
  }

  //Start and keep checking is there is any delimiter in the string
  for(var i = 0; i < delimiters.length; i++){
    delimiterIndex = str.indexOf(delimiters[i]);
    console.log('Delimiter Index: ' + delimiterIndex);

    if(delimiterIndex != -1 && delimiterIndex != 0){
      newString = str.substring(0, delimiterIndex);
      // if(newString.length > 40){
      //   newString = newString.substring(0, 40);
      // }
  //     // if(!isStored(tempString)){
        break
  //     // }
    }
  }
  return newString;
}

var isStored = function(content){
  var contentFound = false;
  for(var i = 0; i < queries.length; i++){
    if(queries[i] == content){
      contentFound = true;
      break
    }
  }
  return contentFound;        
}

var isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
} 