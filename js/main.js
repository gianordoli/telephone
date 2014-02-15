var imageSearch;
var imagesArray;
var index;
var queries;
var delimiters = ['wiki', '!', '?', '_', '|', '»', '-', '(', ',', ':', '.', ' '];

// 2: Load the Google search module
// module: search; version: 1
google.load('search', '1');
  
// 3: Assign the OnLoad function as the callback for the Google search module
//google.setOnLoadCallback(OnLoad);

$('#okButton').click(function(){
  var query = $('#searchBox').val();
  console.log('Calling function: ' + query);
  
  // Clears results div
  $('#content').html('');
  queries = [];
  imagesArray = [];
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
function newSearch(query){
  imagesArray = []; //cleaning the array  
  imageSearch.execute(query);
}

// 6: Looping through all 8 pages and storing each result in a single array
function createArray(){

  if (imageSearch.results && imageSearch.results.length > 0) {

    var cursor = imageSearch.cursor;
    // var curPage = cursor.currentPageIndex; // check what page the app is on
    // for(curPage = 0; curPage < cursor.pages.length; curPage++){
    // for(curPage = 0; curPage < 2; curPage++){
    //   imageSearch.gotoPage(curPage);

      var results = imageSearch.results;
      // console.log(results);            

      for (var j = 0; j < results.length; j++) {
        imagesArray.push(results[j]);
      }
    // }    
  }
  console.log(imagesArray.length);
  searchComplete();
}   

// 7: Displaying the results
function searchComplete() {
  // console.log(imageSearch.results);
  console.log('*****************************************************');

  // For each result write it's title and image to the screen
  var result = imagesArray[0];
  var title = result.titleNoFormatting;
  var content = result.contentNoFormatting;
  var newDiv = '<div class="results">';
  newDiv += '<p><b>' + title + '</b><br>';
  newDiv += content + '</p>';
  newDiv += '<img src="' + result.tbUrl + '" class="thumb"/>';
  newDiv = $.parseHTML(newDiv);
  
  // var newContentWidth = (index + 1)*300;
  // $('#content').css({
  //   'width': newContentWidth
  // });

  $('#content').append(newDiv);

  var query = sliceString(imagesArray[0].titleNoFormatting);

  //Verifying next image title
  for(imageIndex = 0; imageIndex < imagesArray.length; imageIndex++){
    console.log('image index: ' + imageIndex + '/' + imagesArray.length);  

    var originalTitle = imagesArray[imageIndex].titleNoFormatting;
    console.log('Original original title: ' + originalTitle);
    var newQuery = sliceString(originalTitle);
    console.log('Checking query: ' + newQuery);

    // Using content instead of title definitely prevents from ending up in dead ends...
    // var newQuery = sliceString(imagesArray[imageIndex].contentNoFormatting);
    if(isStored(newQuery) || isNumeric(newQuery)){
      console.log('Content already stored.');
    }else{
      console.log('New query: ' + newQuery);
      queries.push(newQuery);
      console.log(queries);
      if(index < 30){
        console.log('--------------------------------' + index);
        index++;
        newSearch(newQuery);
      }                
      break
    }
  }
}

/*---------- AUX FUNCTIONS ----------*/
var sliceString = function(str){

  var dec = decodeURI(str);
  var decHtml = '<p>' + dec + '</p>';
  dec = $.parseHTML(decHtml);
  dec = $(dec).text();
  str = dec;  
  str.toLowerCase();

  var delimiterIndex = -1;
  var newString = str;

  //Start and keep checking is there is any delimiter in the string
  for(var i = 0; i < delimiters.length; i++){
    delimiterIndex = str.indexOf(delimiters[i]);
    console.log('Delimiter Index: ' + delimiterIndex);

    if(delimiterIndex != -1 && delimiterIndex != 0){
      var tempString = str.substring(0, delimiterIndex);
      if(!isStored(tempString)){
        newString = tempString;
        break
      }
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