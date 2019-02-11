$(document).ready(function(){
    // Initialized Firebase
    var config = {
        apiKey: "AIzaSyB5MnEtc1Q3uqY5TMROy6Q5Wx1aCfZcAog",
        authDomain: "inclass-839d9.firebaseapp.com",
        databaseURL: "https://inclass-839d9.firebaseio.com",
        projectId: "inclass-839d9",
        storageBucket: "inclass-839d9.appspot.com",
        messagingSenderId: "856449895514"
      };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // function to calculate when trains will arrive
    var cTime = moment().format('HH:mm');
    console.log(cTime);
    
    var tFrequency;
    var tMinutesTilTrain;
    var nextTrain;

    function trainScheduler(firstTime){
        $('#name-input').val("");
        $('#destination-input').val("");
        $('#firstTrain-input').val("");
        $('#frequency-input').val("");
       
        // First Time 
        var firstTimeConverted = moment(firstTime,"HH:mm").subtract(1,"year");
        console.log('first time converted', firstTimeConverted);
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log('difference in time: ', diffTime);
        // Time apart
        var tRemainder = diffTime % tFrequency;
        console.log('time apart', tRemainder);
        // Minutes until the next train
        tMinutesTilTrain = tFrequency - tRemainder;
        console.log('minutes until next train: ', tMinutesTilTrain);
        // Arrival of next train
        nextTrain = moment(moment().add(tMinutesTilTrain, "minutes")).format("hh:mm");
    
        $("#displaySchedule").append("<div class='row p-2' id='schedBottom'><div class='col-md-3 train-name border-bottom border-secondary'>" +
        trainName +
        "</div><div class='col-md-3 desDiv border-bottom border-secondary'>" + destination +
        "</div><div class='col-md-2 freqDiv border-bottom border-secondary'>" + tFrequency +
        "</div><div class='col-md-2 arrival border-bottom border-secondary'>" + nextTrain +
        "</div><div class='col-md-2 min-2-next border-bottom border-secondary'>" + tMinutesTilTrain +
        "</div>"); 
        
        console.log('next train: ', nextTrain);
       
    };
      
    $("#add-train").on("click", function(){
        event.preventDefault();

        var trainName = $('#name-input').val().trim();
        var destination = $('#destination-input').val().trim();
        var firstTrain = $('#firstTrain-input').val().trim();
        tFrequency = $('#frequency-input').val().trim();

        // trainScheduler(firstTrain);
        database.ref().push({
            name: trainName,
            tDestination: destination,
            frequency: tFrequency,
            fTrain: firstTrain
            });
         
    });

    database.ref().on("child_added", function(childSnapshot){
        firstTrain=childSnapshot.val().fTrain;
        console.log('first train', firstTrain);
        tFrequency=parseInt(childSnapshot.val().frequency);
        console.log('frequency',tFrequency);
        destination=childSnapshot.val().tDestination;
        trainName=childSnapshot.val().name;
        trainScheduler(firstTrain);
    
    }, function(errorObject){
        console.log("Error handled: " + errorObject.code);
    }); 
});