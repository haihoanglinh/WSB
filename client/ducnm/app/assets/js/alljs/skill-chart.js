jQuery(function($){

    "use strict";

    if( typeof Raphael === 'undefined' ) return;

    var SkillDiagram = function( el ) {
        this.el = el;
    }

    SkillDiagram.prototype = {
        init : function() {
            this.cacheElements();
            this.createDiagram();
            this.$skills.each( this.createSkill.bind( this ) );
        },

        cacheElements : function() {
            this.$el = $( this.el );
            this.$skills = this.$el.find( '.skill-chart__arch');
            this.config  = this.$el.data();
            this.config.radius = this.config.dimension / 2;
        },

        random : function( l, u ) {
            return Math.floor( ( Math.random() * ( u - l + 1 ) ) + l );
        },

        createDiagram : function() {
            var self = this;

            this.diagram = Raphael( this.el, this.config.dimension, this.config.dimension );

            this.diagram.circle( this.config.radius, this.config.radius, 80 ).attr({ 
                stroke: 'none', 
                fill: this.config.circleColor 
            });
        
            // Export title
            this.title = this.diagram.text( this.config.radius, this.config.radius, this.config.defaultText ).attr({
                font: "22px helvetica",
                fill: this.config.defaultTextColor
            }).toFront();
            
            this.diagram.customAttributes.arc = function(value, color, rad){
                var v = 3.6 * value,
                    alpha = v == 360 ? 359.99 : v,
                    r  = self.random( 91, 240 ),
                    a  = (r - alpha) * Math.PI/180,
                    b  = r * Math.PI/180,
                    sx = self.config.radius + rad * Math.cos(b),
                    sy = self.config.radius - rad * Math.sin(b),
                    x  = self.config.radius + rad * Math.cos(a),
                    y  = self.config.radius - rad * Math.sin(a),
                    path = [['M', sx, sy], ['A', rad, rad, 0, +(alpha > 180), 1, x, y]];

                return { 
                    path: path, 
                    stroke: color 
                }
            }
        },

        createSkill : function( id, el ) {
            var self   = this,
                $this  = $( el ),
                config = $this.data(),
                radMin = 72,
                radVal = 27,
                newRad = radMin + ( radVal * (id + 1) );

            var $path = this.diagram.path().attr({
                'stroke-width': 28,
                arc: [config.percent, config.color, newRad]
            });

            $path.mouseover( function() {
                self.showSkill( this, config.name, config.percent );
            }).mouseout( function() {
                self.hideSkill( this ) 
            });
        },

        showSkill : function( self, name, percent ) {
            var $this = self,
                time = 250;

            //solves IE problem
            if(Raphael.type != 'VML') $this.toFront();

            $this.animate({ 
                'stroke-width': 50, 
                'opacity': 0.9, 
            }, 800, 'elastic' );

            this.title.stop()
                .animate({ opacity: 0 }, time, '>', function(){
                    this.attr({ text: name + '\n' + percent + '%' }).animate({ opacity: 1 }, time, '<');
                });
        },

        hideSkill : function( self ) {
            var $this = self,
                self = this,
                time = 250;

            $this.stop().animate({ 
                'stroke-width': 28, 
                opacity: 1 
            }, time * 4, 'elastic' );

            self.title.stop()
                .animate({ opacity: 0 }, time, '>', function(){
                    self.title.attr({ text: self.config.defaultText })
                    .animate({ opacity: 1 }, time, '<');
                }); 
        }
    }


    $( '.js-skill-chart__diagram' ).each( function() {
        var diagram = new SkillDiagram( this );
            diagram.init();
    });


});