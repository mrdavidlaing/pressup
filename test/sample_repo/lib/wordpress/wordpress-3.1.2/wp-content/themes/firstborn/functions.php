<?php
define( 'CHILD_DIR', get_stylesheet_directory() );
define( 'CHILD_URL', get_stylesheet_directory_uri() );

// Child theme library
require_once( CHILD_DIR . '/lib/widgets/market-grid-widget.php' );

// Child theme (do not remove)
define('CHILD_THEME_VERSION', '1.0');
define('CHILD_THEME_NAME', 'First Born');
define('CHILD_THEME_URL', '');

// Load Required JS Files
add_action('get_header', 'ci_market_grid_load_scripts');
function ci_market_grid_load_scripts() {
	if ( is_active_widget(0,0, 'ci-market-grid') ) {
	    if ( !is_admin() ) {

	//		wp_enqueue_style( 'jquery-custom-core-css', CHILD_URL . '/lib/js/jquery-ui-1.8.11.custom/css/dark-hive/jquery-ui-1.8.11.custom.css', false, CHILD_THEME_VERSION );
			wp_enqueue_style( 'marketgrid', CHILD_URL . '/lib/widgets/market-grid.css', false, CHILD_THEME_VERSION );
			wp_enqueue_style( 'qtip-css', CHILD_URL . '/lib/css/jquery.qtip.css', false, CHILD_THEME_VERSION );
				    	
			//we need jQuery, jquery-tmpl and a custom version of jquery-ui
			wp_enqueue_script( 'jquery' );
			wp_deregister_script( 'jquery-ui-core' ); 
			wp_enqueue_script( 'jquery-ui-core' , CHILD_URL . '/lib/js/jquery-ui-1.8.11.custom/js/jquery-ui-1.8.11.custom.min.js', array('jquery'), CHILD_THEME_VERSION, true );
			wp_enqueue_script( 'tmpl' , CHILD_URL . '/lib/js/jquery.tmpl.js', array('jquery'), CHILD_THEME_VERSION, true );
			
			//sparkline depends on jQuery
			wp_enqueue_script( 'sparkline' , CHILD_URL . '/lib/js/jquery.sparkline.min.js', array('jquery'), CHILD_THEME_VERSION, true );
			
			//jQuery qTip
			wp_enqueue_script( 'qtip' , CHILD_URL . '/lib/js/jquery.qtip.min.js', array('jquery'), CHILD_THEME_VERSION, true );
			  
			//knockoutJs which needs json2
			wp_enqueue_script( 'json2' );
			wp_enqueue_script( 'knockout' , CHILD_URL . '/lib/js/knockout-1.2.0.debug.js', array('json2','tmpl'), CHILD_THEME_VERSION, true );
			wp_enqueue_script( 'knockout-mapping' , CHILD_URL . '/lib/js/knockout.mapping-latest.js', array('knockout'), CHILD_THEME_VERSION, true );

            wp_enqueue_script( 'modernizer_custom' , CHILD_URL . '/lib/widgets/Chart/js/modernizr.custom.js', CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'chart', CHILD_URL. '/lib/widgets/Chart/js/chart.js', array('modernizer_custom'), CHILD_THEME_VERSION, true );

            //jqPlot depends on jQuery
//            wp_enqueue_style( 'jqplot-css', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/jquery.jqplot.min.css', false, CHILD_THEME_VERSION);
//            wp_enqueue_script( 'jqplot', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/jquery.jqplot.min.js', array('jquery','modernizer_custom'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-1', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.cursor.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-2', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.dateAxisRenderer.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-3', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.canvasTextRenderer.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-4', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-5', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.highlighter.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-6', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.ohlcRenderer.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'jqplot-7', CHILD_URL. '/lib/widgets/Chart/js/libs/jqplot/plugins/jqplot.json2.min.js', array('jqplot'),CHILD_THEME_VERSION, true );
//
//			//finally include the widget code
//			wp_enqueue_script( 'ciapi' ,CHILD_URL . '/lib/js/CIAPI.js', CHILD_THEME_VERSION, true );
//			wp_enqueue_script( 'market-grid', CHILD_URL . '/lib/js/marketGrid.js', array('ciapi', 'jquery-ui-core', 'sparkline', 'knockout', 'knockout-mapping'), CHILD_THEME_VERSION, true );
//			wp_enqueue_script( 'market-grid-styling', CHILD_URL . '/lib/js/marketGridStyling.js', array('market-grid'), CHILD_THEME_VERSION, true );
//            wp_enqueue_script( 'chart', CHILD_URL. '/lib/widgets/Chart/js/chart.js', array('jquery', 'ciapiParser', 'ciapi', 'jqplot', 'jqplot-1', 'jqplot-2', 'jqplot-3', 'jqplot-4', 'jqplot-5', 'jqplot-6', 'jqplot-7'), CHILD_THEME_VERSION, true );
		}
	}
}

// [chart marketId="74424" interval="minute" span="1" priceBars="50" width="200px" height="100px"]
function render_chart_from_shortcode( $atts ) {
	extract( shortcode_atts( array(
		'marketId' => '755',
		'interval' => 'minute',
        'span' => '1',
        'priceBars' => '50',
        'width' => '200px',
        'height' => '100px'
	), $atts ) );

    $CHILD_URL = CHILD_URL;
	return <<<BLOCK
    <div id="chart_$marketId" style="height:$height; width:$width;"></div>
    <script>
    (function(undefined) {
        var baseUrl = "$CHILD_URL/lib/widgets/Chart/";
        Modernizr.load([
            {
               test: window.jQuery,
               nope: "//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"
               ,complete: function() {
                console.log('loaded jquery');
               }
            },
            {
               test: window.jQuery.jqplot,
               nope: [baseUrl+"js/libs/jqplot/jquery.jqplot.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.cursor.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.dateAxisRenderer.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.canvasTextRenderer.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.highlighter.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.ohlcRenderer.min.js",
                      baseUrl+"js/libs/jqplot/plugins/jqplot.json2.min.js",
                      baseUrl+"js/jqplot.ciapiParser.js"
               ]
               ,complete: function() {
                console.log('loaded jqplot')
               }
            },
            {
                test: window.CIAPI,
                nope: [baseUrl+"js/CIAPI-0001.min.js"],
                complete: function() {
                    console.log('loaded CIAPI');
                    Modernizr.load([
                        {
                            test: window.CIAPI.chart,
                            nope: baseUrl+"/js/chart.js",
                            complete: function() {
                                console.log('loaded window.CIAPI.chart');
                                jQuery(document).ready(function() {
                                    var theData = CIAPI.services.GetPriceBars($marketId, '$interval', $span, $priceBars);
                                    CIAPI.chart.plotCandlestickChart({
                                           id: 'chart_$marketId',
                                           title: '1 minute',
                                           data: theData
                                    });
                                });
                            }
                        }
                    ]);
               }
            }
        ]);
    })();
	</script>
BLOCK;
}
add_shortcode( 'chart', 'render_chart_from_shortcode' );

//"$CHILD_URL/lib/js/CIAPI.js"
?>
