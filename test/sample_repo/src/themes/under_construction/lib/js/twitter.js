function relative_time(time_value) {
  var newtime = time_value.replace(',','');
  var values = newtime.split(" ");
  time_value = values[2] + " " + values[1] + ", " + values[3] + " " + values[4];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}

//call Twitter script on DOM ready with jQuery
jQuery(document).ready(function($) {
									
	var username = 'QwibbleDesigns'; //dont forget to insert your Twitter username here

	$.get('php/proxy.php?url=http://twitter.com/statuses/user_timeline/' + username + '.rss?count=1', function(tweets) { //make sure the path to the proxy.php file is correct
		$(tweets).find('item').each(function() {
			var tweet = $(this);
			var pattern = new RegExp("^"+username+": ","g");
			var status = tweet.find('description').text().replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
				return '<a href="'+url+'">'+url+'</a>';
			}).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
				return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
			}).replace(pattern,'');
			var tweetDate = relative_time(tweet.find('pubDate').text());
			$('.loading').fadeOut(750, function() {
				$('#twitter').append($('<p class="date">'+tweetDate+'</p><p>'+status+'</p>').hide().fadeIn(750));									
			});
		});
	});

});