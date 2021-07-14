$("#add_user").submit(function(event){
    alert("Data Inserted Successfully!");
})

/*$("#admin_login").submit(function(event){
    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    
    console.log("data.id" + data.username)
    var request = {
        "url" : `http://`+location.host+`/api/admin`,
        "method" : "POST",
        "data" : data
    }

    $.ajax(request).done(function(response){
        if(response==0){
            alert('Username or Password invalid')
        }
    })
})*/

    
//update user details
$("#update_user").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    
    console.log("data.id" + data.username)
    var request = {
        "url" : `http://`+location.host+`/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

})

//update prescription on patient view
$("#update_prescription").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    
    console.log("data.id" + data.id)
    var request = {
        "url" : `http://`+location.host+`/api/consultation/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
        window.location.href = '/patient-view?id='.concat(data.member_id,'&admin=',data.admin);

    })

})

//slot book post request
function slot_book(i,id,admin){

    console.log(i)
    console.log('index_id '+id)

    var myTab = document.getElementById('slots');   
    console.log(id+' '+i)
    console.log('host: '+location.host);

    row=myTab.rows[i].cells 
    date_time=row.item(0).innerHTML.split(' ',2)
    //console.log(date_time[0]+''+date_time[1])
    date=date_time[0].concat('T',date_time[1],':00+05:30')

    console.log('date: '+date);

    var request = {
        "url" : `http://`+location.host+`/api/slot/${date}/${id}/`,
        "method" : "POST",
        "data" : admin
    }
    
    $.ajax(request).done(function(response){
        console.log(response)
        if (response[0]=='0'){
            alert('Slot booked successfully');
            //location.reload();
            if(admin=="yes"){
                window.location.href = '/patient-view?id='.concat(response[1],'&admin=',admin);
            }
            else{  
                window.location.href = '/patient-view?id='.concat(response[1]);
            }
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

//delete user
if(window.location.pathname == "/"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://`+location.host+`/api/users/${id}`,
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

//delete session
if(window.location.pathname == "/patient-view"){
    getPagination('#session_table')
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("session-id")
        var session = $(this).attr("session")
        console.log('session'+session)

        var request = {
            "url" : `http://`+location.host+`/api/slot/${id}/${session}`,
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

//pagination
/*$('.pagination #prev').on('click', function(evt){
    console.log('clicked prev')
    console.log($('#patient_view').attr('users'))
    if(!first){
        var first = true
        var pagenum= $(this).attr('page')
        console.log('first')
    }
    console.log(pagenum)
    pagenum++
    console.log(pagenum)
    $('#session_table').hide()
})

$('.pagination #next').on('click', function(evt){
    console.log('clicked next')
    $('#session_table').show()
})*/

function getPagination(table,users){
    //$('.pagination').show();
    var totalRows = $(table + ' tbody tr').length;
    console.log(totalRows)
    var trnum = 0; // reset tr counter
    var lastPage = 1;
    $('#maxRows')
    .on('change', function(evt) {
      //$('.paginationprev').html('');						// reset pagination
        console.log('changed')
        lastPage = 1;
        $('.pagination')
        .find('li')
        .slice(1, -1)
        .remove();
        var trnum = 0; // reset tr counter
        var maxRows = parseInt($(this).val()); // get Max Rows from select option

        if (maxRows == 5000) {
        $('.pagination').hide();
        } else {
        $('.pagination').show();
        }

        $(table + ' tr:gt(0)').each(function() {
            trnum++;
            if (trnum > maxRows) {
                // if tr number gt maxRows
    
                $(this).hide(); // fade it out
            }
            if (trnum <= maxRows) {
            $(this).show();
            }
        })

        if (totalRows > maxRows) {
            // if tr total rows gt max rows option
            var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
            //	numbers of pages
            for (var i = 1; i <= pagenum; ) {
            // for each page append pagination li
            $('.pagination #prev')
                .before(
                '<li class = "page" data-page="' +
                    i +
                    '">\
                                    <span>' +
                    i++ +
                    '<span class="sr-only">(current)</span></span>\
                                    </li>'
                )
                .show();
            } // end for i
        } // end if row count > max rows

        $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li

        $('.pagination li').on('click', function(evt) {
            // on click each page
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var pageNum = $(this).attr('data-page'); // get it's number
            console.log(pageNum)

            var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

            if (pageNum == 'prev') {
            if (lastPage == 1) {
                return;
            }
            pageNum = --lastPage;
            }
            if (pageNum == 'next') {
            if (lastPage == $('.pagination li').length - 2) {
                return;
            }
            pageNum = ++lastPage;
            }

            lastPage = pageNum;
            var trIndex = 0; // reset tr counter
            $('.pagination li').removeClass('active'); // remove active class from all li
            $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
            // $(this).addClass('active');					// add active class to the clicked
            limitPagging();
            $(table + ' tr:gt(0)').each(function() {
            // each tr in table not the header
                trIndex++; // tr index counter
            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                if (
                    trIndex > maxRows * pageNum ||
                    trIndex <= maxRows * pageNum - maxRows
                ) {
                    $(this).hide();
                } else {
                    $(this).show();
                } //else fade in
            }); // end of for each tr in table
        }); // end of on click pagination list
	  limitPagging();
    })
    .val(5)
    .change();

  // end of on select change

  // END OF PAGINATION
}

function limitPagging(){
	// alert($('.pagination li').length)

	if($('.pagination li').length > 7 ){
			if( $('.pagination li.active').attr('data-page') <= 3 ){
			$('.pagination li:gt(5)').hide();
			$('.pagination li:lt(5)').show();
			$('.pagination [data-page="next"]').show();
		}if ($('.pagination li.active').attr('data-page') > 3){
			$('.pagination li:gt(0)').hide();
			$('.pagination [data-page="next"]').show();
			for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
				$('.pagination [data-page="'+i+'"]').show();

			}

		}
	}
}
