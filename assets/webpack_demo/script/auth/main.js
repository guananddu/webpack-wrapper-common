/**
 * auth
 * by guananddu@qq.com
 */

require( '../../style/auth/main.less' );

import React,{ Component } from 'react';
import { render } from 'react-dom';

import Children from '../component/react-children/react-children';

class Parent extends Component {
    render() {
        return (
            <div>
                <Children />
                <h3>parent</h3>
            </div>
        )
    }
}

render( <Parent />,document.getElementById( 'root' ) );

///////////////////////////////////////////////////

let util = require( '../util' );
let CONFIG = require( '../config' );

let $container = $( '.container' );
let $uid = $container.find( '#uid' );
let $username = $container.find( '#username' );
let $authdoc = $container.find( '#authdoc' );
let $authClassifyL1 = $container.find( '.auth-classify-sel-l1' );
let $authClassifyL2 = $container.find( '.auth-classify-sel-l2' );
let $authReason = $container.find( '.auth-reason' );
let $authUsername = $container.find( '.auth-username' );
let $authSubmitBtn = $container.find( '.auth-submit-btn' );
let $submitHint = $container.find( '.submit-hint' );
let $form = $container.find( '.form-horizontal' );

$form.validate( CONFIG.authFormConfig );

function submit() {

    let params = {
        uid: $uid.val().trim(),
        name: $username.val().trim(),
        'auth-info': $authdoc.val().trim(),
        'auth-class-1': $authClassifyL1.val().trim(),
        'auth-class-2': $authClassifyL2.val().trim(),
        description: $authReason.val().trim()
    };
    $.ajax( {
        method: 'POST',
        url: CONFIG.api.auth,
        data: params,
        dataType: 'json',
    } ).done( function ( data ) {
        data.status_code == 0
            ? handleSucc( data )
            : handleFail( data );
    } ).fail( function () {
        util.alert( '提交失败，请稍后再试！' );
    } );
}

function clear() {
    $uid.val( '' );
    $username.val( '' );
    $authdoc.val( '' );
    $authClassifyL1.val( '-' );
    $authClassifyL2.val( '-' );
    $authReason.val( '' );
}

function handleFail( data ) {
    util.alert( data.message );
}

function handleSucc( data ) {
    clear();
    util.alert( '提交成功！' );
}

$authSubmitBtn.click( function ( e ) {
    e.preventDefault();
    $form.valid() && submit();
} );