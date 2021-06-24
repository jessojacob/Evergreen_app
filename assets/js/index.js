$("#add_user").submit(function(event){
    alert("Data Inserted Successfully!");
})

$("#update_user").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    
    console.log("data.id" + data.id)
    var request = {
        "url" : `http://localhost:3000/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

})

function slot_book(i,id){

    console.log(i)
    console.log('index_id '+id)

    var myTab = document.getElementById('slots');   
    console.log(id+' '+i)
    console.log('urls: '+document.URL);
    console.log('host: '+document.HOST);

    row=myTab.rows[i].cells
    date_time=row.item(0).innerHTML.split(' ',2)
    //console.log(date_time[0]+''+date_time[1])
    date=date_time[0].concat('T',date_time[1],':00+05:30')

    var request = {
        "url" : `http://localhost:3000/api/slot/${date}/${id}`,
        "method" : "POST"
    }
    
    $.ajax(request).done(function(response){
        console.log(response)
        if (response[0]=='0'){
            alert('Slot booked successfully');
            //location.reload(); 
            window.location.href = '/patient-view?id='.concat(response[1]);
        }
        else if (response=='1'){
            alert('User not found');
        }
        else if (response=='2'){
            alert('Please re-login to continue');
        }
    })    
}

function user_not_found(){
    window.location.href = '/'
}


if(window.location.pathname == "/"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}