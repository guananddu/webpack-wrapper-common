/**
 * util
 * by guananddu@qq.com
 */

$.validator.addMethod( 'checkCls1and2', function ( value, element ) {
    return this.optional( element ) || ( value.trim() !== '-' );
} );

// modal
$( '#modalAlert' ).on( 'show.bs.modal', function ( e ) {
    var _cur = $( e.currentTarget );
    _cur.find( '.modal-msg' ).text( _cur.data( 'hint-text' ) );
    _cur = null;
} );

/**
 * alert
 * @param msg
 */
exports.alert = function ( msg ) {
    $( '#modalAlert' ).data( 'hint-text', msg ).modal( 'show' );
};