/* Author：mingyuhisoft@163.com
 * Github:https://github.com/imingyu/jquery.mloading
 * Npm:npm install jquery.mloading.js
 * Date：2016-7-4
 */

;(function (root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'),root);
    } if(typeof define ==="function"){
        if(define.cmd){
            define(function(require, exports, module){
                var $ = require("jquery");
                factory($,root);
            });
        }else{
            define(["jquery"],function($){
                factory($,root);
            });
        }
    }else {
        factory(root.jQuery,root);
    }
} (typeof window !=="undefined" ? window : this, function ($, root, undefined) {
    'use strict';
    if(!$){
        $ = root.jQuery || null;
    }
    if(!$){
        throw new TypeError("必须引入jquery库方可正常使用！");
    }

    var arraySlice = Array.prototype.slice,
        comparison=function (obj1,obj2) {
            var result=true;
            for(var pro in obj1){
                if(obj1[pro] !== obj2[obj1]){
                    result=true;
                    break;
                }
            }
            return result;
        };

    function MLoading(dom,options) {
        options=options||{};
        this.dom=dom;
        this.options=$.extend(true,{},MLoading.defaultOptions,options);
        this.curtain=null;
        this.render().show();
    }
    MLoading.prototype={
        constructor:MLoading,
        initElement:function () {
            var dom=this.dom,
                ops=this.options;
            var curtainElement=dom.children(".mloading"),
                bodyElement = curtainElement.children('.mloading-body'),
                barElement = bodyElement.children('.mloading-bar'),
                iconElement = barElement.children('.mloading-icon'),
                textElement = barElement.find(".mloading-text");
            if (curtainElement.length == 0) {
                curtainElement = $('<div class="mloading"></div>');
                dom.append(curtainElement);
            }
            if (bodyElement.length == 0) {
                bodyElement = $('<div class="mloading-body"></div>');
                curtainElement.append(bodyElement);
            }
            if (barElement.length == 0) {
                barElement = $('<div class="mloading-bar"></div>');
                bodyElement.append(barElement);
            }
            if (iconElement.length == 0) {
                var _iconElement=document.createElement(ops.iconTag);
                iconElement = $(_iconElement);
                iconElement.addClass("mloading-icon");
                barElement.append(iconElement);
            }
            if (textElement.length == 0) {
                textElement = $('<span class="mloading-text"></span>');
                barElement.append(textElement);
            }
            
            this.curtainElement=curtainElement;
            this.bodyElement = bodyElement;
            this.barElement = barElement;
            this.iconElement = iconElement;
            this.textElement = textElement;
            return this;
        },
        render:function () {
            var dom=this.dom,
                ops=this.options;
            this.initElement();
            if(dom.is("html") || dom.is("body")){
                this.curtainElement.addClass("mloading-full");
            }else{
                this.curtainElement.removeClass("mloading-full");

                if(!dom.hasClass("mloading-container")){
                    dom.addClass("mloading-container");
                }
            }
            if(ops.mask){
                this.curtainElement.addClass("mloading-mask");
            }else{
                this.curtainElement.removeClass("mloading-mask");
            }
            if(ops.content!="" && typeof ops.content!="undefined"){
                if(ops.html){
                    this.bodyElement.html(ops.content);
                }else{
                    this.bodyElement.text(ops.content);
                }
            }else{
                this.iconElement.attr("src",ops.icon);
                if(ops.html){
                    this.textElement.html(ops.text);
                }else{
                    this.textElement.text(ops.text);
                }
            }

            return this;
        },
        setOptions:function (options) {
            options=options||{};
            var oldOptions = this.options;
            this.options = $.extend(true,{},this.options,options);
            if(!comparison(oldOptions,this.options)) this.render();
        },
        show:function () {
            var dom=this.dom,
                ops=this.options,
                barElement=this.barElement;
            this.curtainElement.addClass("active");
            barElement.css({
                "marginTop":"-"+barElement.outerHeight()/2+"px",
                "marginLeft":"-"+barElement.outerWidth()/2+"px"
            });

            return this;
        },
        hide:function () {
            var dom=this.dom,
                ops=this.options;
            this.curtainElement.removeClass("active");
            if(!dom.is("html") && !dom.is("body")){
                dom.removeClass("mloading-container");
            }
            return this;
        },
        destroy:function () {
            var dom=this.dom,
                ops=this.options;
            this.curtainElement.remove();
            if(!dom.is("html") && !dom.is("body")){
                dom.removeClass("mloading-container");
            }
            dom.removeData(MLoading.dataKey);
            return this;
        }
    };
    MLoading.dataKey="MLoading";
    MLoading.defaultOptions = {
        text:"加载中...",
        iconTag:"img",
        icon:"data:image/gif;base64,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",
        html:false,
        content:"",//设置content后，text和icon设置将无效
        mask:true//是否显示遮罩（半透明背景）
    };

    $.fn.mLoading=function (options) {
        var ops={},
            funName="",
            funArgs=[];
        if(typeof options==="object"){
            ops = options;
        }else if(typeof options ==="string"){
            funName=options;
            funArgs = arraySlice.call(arguments).splice(0,1);
        }
        return this.each(function (i,element) {
            var dom = $(element),
                plsInc=dom.data(MLoading.dataKey);
            if(!plsInc){
                plsInc=new MLoading(dom,ops);
            }

            if(funName){
                var fun = plsInc[funName];
                if(typeof fun==="function"){
                    fun.apply(plsInc,funArgs);
                }
            }
        });
    }
}));