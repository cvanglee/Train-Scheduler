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
    //   var trainName = "Thomas the Train";
    //   var destination = "Brendon Dock";
    //   var firstTime = "23:00";
    var tFrequency = 4;
    var tMinutesTilTrain;
    var nextTrain;

    function trainScheduler(firstTime){
        // First Time 
        var firstTimeConverted = moment(firstTime,"HH:mm").subtract(1,"year");
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log('difference in timed: ', diffTime);
        // Time apart
        var tRemainder = diffTime % tFrequency;
        console.log('time apart', tRemainder);
        // Minutes unti the next train
        tMinutesTilTrain = tFrequency - tRemainder;
        console.log('minutes until next train: ', tMinutesTilTrain);
        // Arrival of next train
        nextTrain = moment(moment().add(tMinutesTilTrain, "minutes")).format("hh:mm");
        
        console.log('next train: ', nextTrain);
       
    };
      
    $("#add-train").on("click", function(){
        event.preventDefault();

        var trainName = $('#name-input').val().trim();
        var destination = $('#destination-input').val().trim();
        var firstTrain = $('#firstTrain-input').val().trim();
        tFrequency = $('#frequency-input').val().trim();

        trainScheduler(firstTrain);
        database.ref().push({
            name: trainName,
            tDestination: destination,
            frequency: tFrequency,
            min2Next: tMinutesTilTrain,
            arrivalTime: nextTrain
            });
          
    });

    database.ref().on("child_added", function(childSnapshot){
        $("#displaySchedule").append("<div class='row p-2' id='schedBottom'><div class='col-md-3 train-name border-bottom border-secondary'>" +
        childSnapshot.val().name +
        "</div><div class='col-md-3 desDiv border-bottom border-secondary'>" + childSnapshot.val().tDestination +
        "</div><div class='col-md-2 freqDiv border-bottom border-secondary'>" + childSnapshot.val().frequency +
        "</div><div class='col-md-2 arrival border-bottom border-secondary'>" + childSnapshot.val().arrivalTime +
        "</div><div class='col-md-2 min-2-next border-bottom border-secondary'>" + childSnapshot.val().min2Next +
        "</div>"); 
    }, function(errorObject){
        console.log("Error handled: " + errorObject.code);
    }); 
});