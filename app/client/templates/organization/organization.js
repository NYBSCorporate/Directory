generateOrgChart = function(){
	google.load("visualization", "1", {packages:["orgchart"], callback: drawChart});
      //google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Manager');
        data.addColumn('string', 'ToolTip');

        var memberCursor = Members.find({},{fields: {_id: 1, name: 1, role: 1, avatarURL: 1, reportsTo: 1}});
        var numberOfRows = memberCursor.count();
        memberCursor.forEach(function(member){
        	data.addRow([{v: member._id, f:'<img class="img-circle thumb" src="'+member.avatarURL+'" /><br />'+member.name+'<br />'+member.role}, member.reportsTo, '']);
        });

        for(var i=0; i < numberOfRows;i++){
        	data.setRowProperty(i,'style','border:none;background:none;box-shadow:none');	
        }
        

        var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
        chart.draw(data, {allowHtml:true});
      }
}

/*****************************************************************************/
/* Organization: Event Handlers */
/*****************************************************************************/
Template.Organization.events({
});

/*****************************************************************************/
/* Organization: Helpers */
/*****************************************************************************/
Template.Organization.helpers({
});

/*****************************************************************************/
/* Organization: Lifecycle Hooks */
/*****************************************************************************/
Template.Organization.created = function () {
	generateOrgChart();
};

Template.Organization.rendered = function () {
	
};

Template.Organization.destroyed = function () {
};



