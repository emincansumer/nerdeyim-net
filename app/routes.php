<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
use Carbon\Carbon;

/**
 * Home route
 */
Route::get('/', function() 
{
    // delete unused codes
    Code::where('updated_at', '<', Carbon::now()->subHour())->delete();
    // show homepage
    return View::make('home');
});

/**
 * Create a new code for room
 */
Route::get('/create', array('before' => 'nonajax', function()
{
    // try to get a code 10 times
    for($i = 0; $i < 10; $i++){
        // create a random code btw 100 and 999
        $room = rand(100, 999);
        // if code not exists create and assign
        if(!Code::where('value', $room)->first()) {
            $code = Code::create(array('value' => $room, 'in_use' => 1));
            return array('code' => $code->value);
        }
        // so we are so busy
        if($i === 9) {
            return array('error' => array(
                'type'    => 'Server',
                'message' => 'Hata oluştu! Lütfen tekrar deneyiniz.',
                'file'    => 'routes',
                'line'    => 37,
            ));
        }
    }
    
}));

/**
 * Show room
 */
Route::get('{code}', array('before' => 'threedigit', function($code)
{
    return View::make('map');
}));
