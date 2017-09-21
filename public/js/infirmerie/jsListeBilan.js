    var base_url = window.location.toString();
	var tabUrl = base_url.split("public");
    
    /**********************************************************************************/
    /**********************************************************************************/
    /**********************************************************************************/
    /**********************************************************************************/

	$(function(){
		setTimeout(function() {
			infoBulle();
		}, 1000);
	});

	function infoBulle(){
	
		/***
		 * INFO BULLE DE LA LISTE
		 */

		var tooltips = $( 'table tbody tr td infoBulleVue' ).tooltip({show: {effect: 'slideDown', delay: 250}});
		tooltips.tooltip( 'close' );
		$('table tbody tr td infoBulleVue').mouseenter(function(){
			var tooltips = $( 'table tbody tr td infoBulleVue' ).tooltip({show: {effect: 'slideDown', delay: 250}});
			tooltips.tooltip( 'open' );
		});
	}
	
    var  oTable;
    function initialisation(){	
    	
     var asInitVals = new Array();
	 oTable = $('#patientAdmis').dataTable
	 ( {
		        
		  "sPaginationType": "full_numbers",
		  "aLengthMenu": [5,7,10,15],
		  "aaSorting": [], //On ne trie pas la liste automatiquement
		  "oLanguage": {
				"sInfo": "_START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
				"sInfoEmpty": "0 &eacute;l&eacute;ment &agrave; afficher",
				"sInfoFiltered": "",
				"sUrl": "",
				"oPaginate": {
					"sFirst":    "|<",
					"sPrevious": "<",
					"sNext":     ">",
					"sLast":     ">|"
					}
			   },
					   	
			   "sAjaxSource": ""+tabUrl[0]+"public/infirmerie/liste-bilan-ajax", 
			   
			   "fnDrawCallback": function() 
				{
					//markLine();
					clickRowHandler();
				}
	} );

	//le filtre du select
	$('#filter_statut').change(function() 
	{					
		oTable.fnFilter( this.value );
	});
	
	$('#liste_service').change(function()
	{					
		oTable.fnFilter( this.value );
	});
	
	$("tfoot input").keyup( function () {
		/* Filter on the column (the index) of this element */
		oTable.fnFilter( this.value, $("tfoot input").index(this) );
	} );
	
	/*
	 * Support functions to provide a little bit of 'user friendlyness' to the textboxes in 
	 * the footer
	 */
	$("tfoot input").each( function (i) {
		asInitVals[i] = this.value;
	} );
	
	$("tfoot input").focus( function () {
		if ( this.className == "search_init" )
		{
			this.className = "";
			this.value = "";
		}
	} );
	
	$("tfoot input").blur( function (i) {
		if ( this.value == "" )
		{
			this.className = "search_init";
			this.value = asInitVals[$("tfoot input").index(this)];
		}
	} );

    $(".boutonAnnuler").html('<button type="submit" id="terminer" style=" font-family: police2; font-size: 17px; font-weight: bold;"> Annuler </button>');
    $(".boutonValider").html('<button type="submit" id="terminer" style=" font-family: police2; font-size: 17px; font-weight: bold;"> Valider </button>');

    $(".boutonTerminer").html('<button type="submit" id="terminer" style=" font-family: police2; font-size: 17px; font-weight: bold;"> Terminer </button>');

    }
    
    
    function clickRowHandler() 
    {
    	var id;
    	$('#patientAdmis tbody tr').contextmenu({
    		target: '#context-menu',
    		onItem: function (context, e) { 
    			
    			if($(e.target).text() == 'Visualiser' || $(e.target).is('#visualiserCTX')){
    				if(id){ bilanPrelevement(id); }
    			} 
    			
    		}
    	
    	}).bind('mousedown', function (e) {
    			var aData = oTable.fnGetData( this );
    		    id = aData[7]; 
    	});
    	
    	
    	
    	$("#patientAdmis tbody tr").bind('dblclick', function (event) {
    		var aData = oTable.fnGetData( this );
    		var id = aData[7]; 
    		if(id){ bilanPrelevement(id); }
    	});
    	
    	$('a,img,hass').tooltip({ animation: true, html: true, placement: 'bottom', show: { effect: 'slideDown', } });
    }
    
    
    function bilanPrelevement(idfacturation){
    	
    	$('#boutonAnnulerTerminer').toggle(false);
    	$('#boutonTerminer').toggle(true);
    	
        var chemin = tabUrl[0]+'public/infirmerie/bilan-analyses-facturees';
        $.ajax({
            type: 'POST',
            url: chemin ,
            data:{'idfacturation':idfacturation},
            success: function(data) {
       	    
            	$('#titre span').html('INFORMATIONS SUR LE BILAN');
            	     var result = jQuery.parseJSON(data);  
            	     $("#contenu").fadeOut(function(){ $("#vue_patient").html(result); $("#interfaceListeFactures").fadeIn("fast"); }); 
            	     
                     $('.boutonTerminer').click(function(){
                    	 
                    	 $('#interfaceListeFactures').fadeOut(function(){
             	    		$('#titre span').html('LISTE DES PATIENTS'); 
             	    		$('#contenu').fadeIn(300);
             	    	 });
            	    	 
            	     });
            },
            error:function(e){console.log(e);alert("Une erreur interne est survenue!");},
            dataType: "html"
        });
    }
    
    

    function infos_parentales(id)
    {
    	
    	$('#infos_parentales_'+id).w2overlay({ html: "" +
    		"" +
    		"<div style='border-bottom:1px solid green; height: 30px; background: #f9f9f9; width: 600px; text-align:center; padding-top: 10px; font-size: 13px; color: green; font-weight: bold;'><img style='padding-right: 10px;' src='"+tabUrl[0]+"public/images_icons/Infos_parentales.png' >Informations parentales</div>" +
    		"<div style='height: 245px; width: 600px; padding-top:10px; text-align:center;'>" +
    		"<div style='height: 77%; width: 95%; max-height: 77%; max-width: 95%; ' class='infos_parentales' align='left'>  </div>" +
    		"</div>"+
    		"<script> $('.infos_parentales').html( $('.infos_parentales_tampon').html() ); </script>" 
    	});
    	
    }
    
    function getdifficultes(val)
    {
    	if(val == 0){
    		$('.reductTextarea textarea').val('Néant').attr({'readonly':true});
    	}else{
    		$('.reductTextarea textarea').val('').attr({'readonly':false});
    	}
    }

    function getMomentTransfusion(val)
    {
    	if(val == 0){
    		$('.reductSelect2 select').val('').attr({'disabled':true});
    	}else{
    		$('.reductSelect2 select').val(1).attr({'disabled':false});
    	}
    }
    
    
    function initForm()
    {
    	
    	$('#date_heure').datetimepicker(
    		$.datepicker.regional['fr'] = {
    			dateFormat: 'dd/mm/yy -', 
    			timeText: 'H:M', 
    			hourText: 'Heure', 
    			minuteText: 'Minute', 
    			currentText: 'Actuellement', 
    			closeText: 'F',
    			showAnim : 'bounce',
    			maxDate : '0',
    		} 
    	);
    	
    }
    
    function modifierBilan(idfacturation)
    {
    	$('#boutonAnnulerTerminer').toggle(true);
    	$('#boutonTerminer').toggle(false);
    	
        var chemin = tabUrl[0]+'public/infirmerie/modifier-bilan-analyses';
        $.ajax({
            type: 'POST',
            url: chemin ,
            data:{'idfacturation':idfacturation},
            success: function(data) {
       	    
            	$('#titre span').html('MODIFIER LES INFORMATIONS SUR LE BILAN');
            	     var result = jQuery.parseJSON(data);  
            	     $("#contenu").fadeOut(function(){ $("#vue_patient").html(result); $("#interfaceListeFactures").fadeIn("fast"); }); 
            	     
            	     $('.boutonAnnuler').click(function(){
            	    	 
            	    	 $('#interfaceListeFactures').fadeOut(function(){
            	    		$('#titre span').html('LISTE DES PATIENTS ADMIS'); 
            	    		$('#contenu').fadeIn(300);
            	    	 });
            	    		 
            	     });
            	     
                     $('.boutonValider').click(function(){
            	    	 
            	    	 //Validation du formulaire
            	    	 $('#validerForm').trigger('click');
            	    	 
            	     });
            },
            error:function(e){console.log(e);alert("Une erreur interne est survenue!");},
            dataType: "html"
        });
    
    }
	