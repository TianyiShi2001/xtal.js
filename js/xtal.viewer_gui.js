/*

xtal.js Various GUI objects for standalone model+map viewer.

Exports:

*/
var xtal = (function(module) {return module})(xtal||{});
xtal.viewer = (function(module) {
	// Exports
	return {
	}
})(xtal);

//----------------------------------------------------------------------
// JQUERY GUI STUFF

function expandPanel() {
  $('#loadControls').fadeIn('fast');
  $('#loadControlsButton').click(collapsePanel);
  $('#loadControlsShow').text("Hide controls");
};

function collapsePanel() {
//  $('#loadControlsHandle').toggle(true);
  $('#loadControls').fadeOut('fast');
  $('#loadControlsButton').unbind('click');
  $('#loadControlsButton').click(expandPanel);
  $('#loadControlsShow').text("Load structure...");
};

function expandFeatures() {
  //$("#featureHeader").toggle(false);
  $("#featureList").slideDown('fast');
  $('#featureHandle').click(collapseFeatures);
};

function collapseFeatures() {
  //$("#featureHeader").toggle(true);
  $("#featureList").slideUp('fast');
};

function init_gui () {
  $(document).ready(function() {
    /* expandPanel on click, too - good for mobile devices without mouse */
    $('#loadControlsButton').click(expandPanel);
    $('#featureHandle').click(expandFeatures);
    $('#featureHandle').hoverIntent({
      over: expandFeatures,
      timeout: 10,
      out: function() {return true;}
    });
    $('#featureList').hoverIntent({
      over: function() { return true;},
      timeout: 10,
      out: collapseFeatures
    });
  });
}

function display_features_gui (viewer, features) {
  $("#featureList").empty();
  console.log("Adding " + features.length + " features");
  expandFeatures();
  for (var i = 0; i < features.length; i++) {
    var inner = $("<div/>", {
      id:"feature"+i,
      class:"featureItem"}).text(features[i][0]);
    var outer = $("<div/>", {
        id:"featuresMargin",
        class:"controlMargin" }).text('');
    outer.append(inner);
    outer.appendTo("#featureList");
    inner.data("Data",{
        label: features[i][0],
        xyz: features[i][1]
      });
    inner.click(function () {
      var data = $(this).data("Data");
      viewer.zoomXYZ(data.xyz);
    });
  }
  //$("featureList").html();
  list_height = 0
  list_height = $("#featuresBoxInner").height();
  //$("#featuresBoxInner").children().each(function () {
  //  list_height += $(this).height();
  //});
  console.log("height: " + list_height);
  //$("#featureBox").height(Math.min(200, list_height));
}

function getQuery(viewer, query) {
  if (! query) {
    query = window.location.search.substring(1);
  }
  var vars = query.split("&");
  have_query = false;
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == 'model') {
      viewer.load_mmcif("data/" + pair[1] + ".cif", pair[1]);
      have_query = true;
    } else if (pair[0] == "cif") {
      viewer.load_cif("data/" + pair[1] + ".cif", pair[1]);
      have_query = true;
    } else if (pair[0] == 'monlib') {
      viewer.load_mon_lib("data/" + pair[1] + ".cif", pair[1]);
      have_query = true;
    } else if (pair[0] == "pdb") {
      viewer.load_pdb("data/" + pair[1] + ".pdb", pair[1]);
      have_query = true;
    } else if (pair[0] == "map") {
      viewer.load_ccp4_map("data/" + pair[1], pair[1], 0);
      have_query = true;
    } else if (pair[0] == "omap") {
      viewer.load_dsn6_map("data/" + pair[1], pair[1], 0);
      have_query = true;
    }
  }
  return have_query;
}

function requestFromServer (evt) {
  collapsePanel();
  reset_viewer();
  var pdb_id = $("#pdbIdInput").val();
  requestPDB(pdb_id);
}

function loadPDBFromForm (viewer, input_id) {
  if (! input_id) {
    input_id = "#pdbIdInput";
  }
  var pdb_id = $(input_id).val();
  validate_pdb_id(pdb_id);
  viewer.fetchPDB(pdb_id);
}
