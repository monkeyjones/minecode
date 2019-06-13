/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

new (function() {
    var ext = this;

	var	ws_connected=false;
	var	ws_playername;
	var	ws_error=false;
	var ws_callback;

	
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() 
	{
		if(!ws_connected) return {status: 1, msg: 'Not connected'};

		if(ws_error)
		    return {status: 0, msg: 'Error'};
		else		
			return {status: 2, msg: 'Ready'};
    };	
	
	ext.connect = function(server,port,player,callback) 
	{
		if(ws_connected)
			callback();
		else
			ws_open(server,port,player,callback);
    };
	ext.setblock = function(block, type, x, y, z,callback) 
	{
		mine_command("world.block_relative/"+block+"/"+type+"/"+x+"/"+y+"/"+z,callback);
		//callback();
    };
	
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
  		    ['w', 'connect to server %s port %n user %s',	'connect', "104.193.181.74",6162,"thecoderockers"],
  		    ['w', 'set block %n type %n in x+%n, y+%n, z+%n',	'setblock', 1,0,0,0,0],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Minecode', descriptor, ext);
	
	function mine_command(data, callback)
	{
		//alert(data);
		if((!ws_connected)||(ws_error))
		{
			callback();
			return;
		}
		ws_callback=callback;
		ws.send(data);
	}
	function ws_open(server, port, player,callback)
	{
		ws_callback=callback;
		ws_error=false;
		ws_connected=false;
		ws_playername=player;
		ws=new WebSocket("ws://"+server+":"+port);
		ws.onopen=ws_onopen;
		ws.onclose=ws_onclose;
		ws.onmessage=ws_onmessage;
		ws.onerror=ws_onerror;
	}
	
	function ws_onopen(e)
	{
		ws_connected=true;
		mine_command("player_name/"+ws_playername,ws_callback);
	}
	
	function ws_onclose(e)
	{
		//if(e.code==1006)
		//	alert("Error conectando con servidor");
		//else
		ws_connected=false;
		ws=null;
		if(ws_error)
		{
			ws_error=false;
		}else{
			ws_callback();
		}
	}

	function ws_onerror(e)
	{
		//alert("error:"+e.code);
	};

	function ws_onmessage(e)
	{
		//alert(e.data);
		var data = JSON.parse(e.data);
		if((data.msg=="OK") || (data.msg=="CONTINUE"))
		{	
			if(data.info)
			{
				if(data.info=="result")
				{
				}else{
					if(data.info=="position")
					{
					}else{
						if(data.info=="input")
						{
						}
					}
				}				
			}
		}else{
			if(data.msg=="ERROR")
			{	
				$("#server_state circle").attr("class", "server_error");

				//var error_msg=MSG.ERROR_UNKNOWN;
				//if(MSG[data.info]) 
				//	error_msg=data.info;

				//log_msg(MSG[error_msg],true);
			
				ws_error=true;
				ws_close();
			}else{
				//log_msg(MSG[data.msg],false); //LOGGED
			}
		}
		ws_callback();
	}
	
	function ws_close()
	{
		if(ws) ws.close();
	}

})();