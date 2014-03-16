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
google.setOnLoadCallback(searchSetup);

//API setup
function searchSetup() {

  // Create an Image Search instance.
  imageSearch = new google.search.ImageSearch();

  imageSearch.setResultSetSize(8);

  // Set searchComplete as the callback function when a search is 
  // complete.  The imageSearch object will have results in it.
  // imageSearch.setSearchCompleteCallback(this, searchComplete, null);
  imageSearch.setSearchCompleteCallback(this, createArray, null);
}  

// 4: Triggers the first search / Cleans up whatever has been searched before 
$('#searchBox').keypress(function(e) {
  if (e.keyCode == 13) {
      start();
  }
});

$('#okButton').click(function(){
  start();
});

function start(){
  var query = $('#searchBox').val();
  console.log('Calling function: ' + query);
  
  // Clears results div
  $('#firstImage').html('');
  $('#content').html('');
  $('#lastImage').html('');
  maxSearches = 20;
  queries = [];
  allResults = [];
  allImages = [];
  index = 0;

  // searchSetup(query);  
  newSearch(query);
}



// 5: Executes the search
function newSearch(str){
  imageSearch.execute(str);
  console.log("Calling new search");
}       


// 6: Storing each result in a single array
function createArray(){
  console.log('Creating array...');

  if (imageSearch.results && imageSearch.results.length > 0) {
    console.log('Results found');

    allResults.push(imageSearch.results[0]);

    var imageObj = new Image();
    imageObj.src = imageSearch.results[0].tbUrl;     
    allImages.push(imageObj);

    console.log(allResults.length);
    searchComplete();

  //no more results found!
  }else{
    console.log('No results found');
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
  console.log('Calling images display...');
  //Wait for the last image to be loaded before calling setup
  // allImages[allImages.length - 1].onload = function() {
    setup();
  // };
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