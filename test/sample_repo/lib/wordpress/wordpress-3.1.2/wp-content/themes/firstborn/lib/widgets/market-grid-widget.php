<?php
/**
 * The Market Grid Slider as a standard drop in widget
**/

add_action('widgets_init', create_function('', "register_widget('CI_Market_Grid');"));
class CI_Market_Grid extends WP_Widget {

	function CI_Market_Grid() {
		$widget_ops = array( 'classname' => 'ci-market-grid', 'description' => __('City Index Market Grid Widget', 'genesis') );
		$control_ops = array( 'width' => 200, 'height' => 250, 'id_base' => 'ci-market-grid' );
		$this->WP_Widget( 'ci-market-grid', __('City Index - Market Grid', 'genesis'), $widget_ops, $control_ops );
	}

	function widget($args, $instance) {
		extract($args);
		
		echo $before_widget;
		?>

			<div id="marketGrid">
			    <table>
			        <thead>
			            <tr>
			                <th class="mg-market">Market</th>
			                <th class="mg-change">Change</th>
			                <th class="mg-offer">Offer</th>
			                <th class="mg-bid">Bid</th>
			
			            </tr>
			        </thead>
			        <tbody data-bind='template: { 
			                            name: "itemTemplate", 
			                            foreach: marketList 
			                          }'></tbody>
			    </table>
			    <div id="mg-search-box">
			        <input id="marketSearchQuery" name="marketSearch" type="text" value="USD"/>
			        <button id="doMarketSearchButton" data-bind="click: doMarketSearch">Search</button>
			    </div>    
			    <script type="text/html" id="itemTemplate">
			        <tr class="mg-row" data-bind="attr: { id: MarketId() + '_qtip_row' }">
			            <td class="mg-market"><span data-bind="text: Name">loading...</span></td>
			            <td class="mg-change"><span data-bind="text: currentPrice.change().toFixed(5), css: { red: currentPrice.change() < 0 }">loading...</span></td>
			            <td class="mg-offer"><span data-bind="text: currentPrice.offer().toFixed(5)">loading...</span></td>
			            <td class="mg-bid"><span data-bind="text: currentPrice.bid().toFixed(5)">loading...</span></td>
			  
			        </tr>
			        <tr class="mg-row">
			            <td class="mg-sparkline" colspan="4">
			            	<span data-bind="attr: { id: MarketId() + '_sparkline'}">rendering...</span>
			            	<div class="mg_hidden" data-bind="attr: { id: MarketId() + '_qtip_content'}">
			            		<table>
			            			<tr>
						                <th>High</th>
						                <th>Low</th>            				
			            			</tr>
			            			<tr>
							          	<td data-bind="text: currentPrice.high().toFixed(5)">1.3876</td>
										<td data-bind="text: currentPrice.low().toFixed(5)">1.3876</td>
			            			</tr>
			            				
			        			</table>
			    			</div>
						</td>
			        </tr>
			    </script>
			</div>

		<?php
		
		
	}

	function update($new_instance, $old_instance) {
		return $new_instance;
	}

}
?>
