var viewer;

window.onload = function() {
	// cache kz maps
	$.getJSON('https://kztimerglobal.com/api/v2.0/maps?is_validated=true&limit=9999', function (data)
	{
		$.each(data, function (index, value)
		{
			$("#mapNameDatalist").append('<option value="' + EscapeHtml(value.name) + '">');
		})
	});
	
	var tprunDropDown = document.getElementById("tpRun-dropdown");
	if (tprunDropDown)
	{
		tprunDropDown.addEventListener("change", function() {
			UpdateMaptop(0);
		}, false);
	}
	
	var modeDropDown = document.getElementById("mode-dropdown");
	if (modeDropDown)
	{
		modeDropDown.addEventListener("change", function() {
			UpdateMaptop(0);
		}, false);
	}
	
	viewer = new Gokz.ReplayViewer(document.getElementById("map-view"));
	viewer.mapBaseUrl = "resources/maps";

	viewer.replayLoaded.addListener(function(replay) {
		var title = GetReplayDescription(replay);
		document.getElementById("title").innerText = title;
		document.title = title;
	});

	var searchParams = new URLSearchParams(window.location.search);
	var replayUrl = searchParams.get("replay");

	if (replayUrl != null)
	{
		viewer.isPlaying = true;
		viewer.loadReplay("https://kztimerglobal.com/api/v2/records/replay/" + encodeURIComponent(replayUrl));
		viewer.animate();
	}
	else
	{
		viewer.showMessage("No replay URL provided");
	}
}

function EscapeHtml(string)
{
	let text = document.createTextNode(string);
	let temp = document.createElement("temp");
	temp.appendChild(text);
	return temp.innerHTML;
}

function RemoveAllChildrenFromNode(node)
{
	while (node.lastChild != null)
	{
		node.removeChild(node.lastChild);
	}
	return node;
}

function GetReplayDescription(replay)
{
	let mins = Math.floor(replay.time / 60);
	let secs = replay.time - (mins * 60);
	let secsString = secs.toFixed(3);
	
	let title = EscapeHtml(replay.playerName)
			+ " - " + EscapeHtml(replay.mapName)
			+ " - " + mins + ":" + (secsString.indexOf(".") === 1 ? "0" : "") + secsString
			+ " [" + Gokz.GlobalMode[replay.mode].toUpperCase() + "]"
			+ " [" + (replay.teleportsUsed === 0 ? "PRO" : "NUB") + "]";
	return title;
}

function GetRunType()
{
	var e = document.getElementById("tpRun-dropdown");
	return e.options[e.selectedIndex].value;
}

function GetRunMode()
{
	var e = document.getElementById("mode-dropdown");
	return e.options[e.selectedIndex].value;
}

function CreatePlayerProfileLink(steamID, playerName)
{
	return "<a href=\"http://steamcommunity.com/profiles/" + encodeURIComponent(steamID) + "\">" + EscapeHtml(playerName) + "</a>"
}

function CreateReplayLink(replayId)
{
	return "<a href=?replay=" + replayId + ">Play Replay</a>"
}

function FormatTime(fTime)
{
	var roundedTime = Math.floor(fTime)
	var hours = Math.floor(roundedTime / 3600)
	var minutes = Math.floor(roundedTime / 60 - hours * 60)
	var seconds = Math.floor(roundedTime - hours * 3600 - minutes * 60)
	var centiseconds = Math.floor((parseFloat(fTime) - roundedTime) * 100)

	var timeString = ""
	
	function padTime(string, time)
	{
		if (time < 10)
		{
			string = `${string}0`
		}
		return string;
	}
	
	if (hours != 0)
	{
		timeString += `${hours}:`
	}
	timeString += minutes < 10 ? `0${minutes}:` : `${minutes}:`
	timeString += seconds < 10 ? `0${seconds}.` : `${seconds}.`
	timeString += centiseconds < 10 ? `0${centiseconds}` : `${centiseconds}`

	return timeString;
}

var g_mapTopCallId = 0;
function UpdateMaptopDoCall(callId, mapName, stage)
{
	$.getJSON("https://kztimerglobal.com/api/v2.0/records/top?map_name="
		+ mapName + "&tickrate=128&stage=" + stage + "&modes_list=" + GetRunMode() + "&has_teleports=" + GetRunType() + "&limit=100", function (data)
	{
		// prevent race condition (is that the right term?)
		if (callId != g_mapTopCallId)
		{
			return;
		}
		RemoveAllChildrenFromNode(document.getElementById("replay-list-list"))
		if (data.length == 0)
		{
			return
		}
		let dateOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			// hour: "2-digit",
			// minute: "2-digit",
			// second: "2-digit"
		}
		$.each(data, function (index, value)
		{
			let replayId = data[index].replay_id;
			if (replayId !== 0 && !isNaN(replayId))
			{
				$("#replay-list-list").append("\
				<tr>\
					<td>" + CreateReplayLink(replayId) + "</td>\
					<td>" + (index + 1) + "</td>\
					<td>" + CreatePlayerProfileLink(data[index].steamid64, data[index].player_name) + "</td>\
					<td>" + EscapeHtml(FormatTime(data[index].time)) + "</td>\
					<td>" + EscapeHtml(data[index].teleports) + "</td>\
					<td>" + new Date(data[index].created_on).toLocaleDateString("en-GB", dateOptions) + "</td>\
				</tr>")
			}
		})
	})
}

function UpdateMaptop()
{
	console.log("update");;
	RemoveAllChildrenFromNode(document.getElementById("replay-list-list"));
	$("#replay-list-list").append("Loading...");
	
	let mapName = document.getElementById("mapNameInput").value;
	let stage = parseInt(document.getElementById("stageInput").value);
	
	if (typeof stage !== "number")
	{
		stage = 0;
	}
	if (stage < 0)
	{
		stage = 0;
	}
	
	g_mapTopCallId += 1;
	UpdateMaptopDoCall(g_mapTopCallId, mapName, stage);
}
