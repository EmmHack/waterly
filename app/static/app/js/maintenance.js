function showDashboard()
{
    $('#myInsights').hide(1000);
    $('#leaderBoardPage').hide(1000);
    $('#landingPage').show(2000);
}

function showMyInsights()
{
    $('#landingPage').hide(1000);
    $('#leaderBoardPage').hide(1000);
    $('#myInsights').show(2000);
}

function showLeaderBoard()
{
    $('#landingPage').hide(1000);
    $('#myInsights').hide(1000);
    $('#leaderBoardPage').show(2000);
}


function showLeader()
{
    $('#leader').show(2000);
}