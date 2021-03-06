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
                'line'    => 42,
            ));
        }
    }
    
}));

/**
 * Check the code
 */
Route::get('/check-code', array('before' => 'nonajax', function()
{
    $code = Code::where('value', Input::get('code'))->first();
    // the code isn't found
    if(!$code) {
        return array('error' => array(
            'type'    => 'App',
            'message' => 'Kod bulunamadı. Lütfen doğruluğundan emin olup tekrar deneyiniz.',
            'file'    => 'routes',
            'line'    => 60,
        ));
    }
    // check if the code is already in use by two users
    $num_of_users = User::where('code_id', $code->id)->count();
    if($num_of_users >= 2){
        return array('error' => array(
            'type'    => 'App',
            'message' => 'Kod kullanımda. Lütfen yeni bir paylaşım başlatınız.',
            'file'    => 'routes',
            'line'    => 69,
        ));
    }
    // code is available, so send it back again
    return array('code' => $code->value);
}));

/**
 * Show room
 */
Route::get('{code}', array('before' => 'threedigit', function($code)
{
    $room         = Code::where('value', $code)->first();
    $num_of_users = User::where('code_id', $room->id)->count();
    // only allow max. 2 people in a share session
    if($num_of_users < 2) {
        $user = User::create(array('code_id' => $room->id));
        return View::make('map', compact('user', 'room'));
    }

    return Redirect::to('/');
}));

/**
 * Update location of a user
 */
Route::post('update-location', array('before' => 'nonajax', function()
{
    $user_id = Input::get('user_id');
    $user = User::find($user_id);

    $result = new StdClass;
    if($user){
        $user->lat = Input::get('lat');
        $user->lng = Input::get('lng');
        $user->save();
        $result->user = $user;
        // ping to code not to be deleted
        $code = Code::find($user->code_id);
        $code->touch();
        // get other user
        $match = User::where(function($query) use ($user){
            $query->where('id', '!=', $user->id)
                  ->where('code_id', $user->code_id);
        })->first();
    }

    if(!empty($match->id)){
        return $match;
    }

    return null;
    
}));