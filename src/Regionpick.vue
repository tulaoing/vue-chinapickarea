<template>
  <div class="regionpickbox" v-if="show" v-on:click="show=false"  @touchmove="_stopDef"  @mousewheel="_stopDef">
      <div class="regionpickarea" v-on:click.stop=''>
          <div class="title">
              <div>取消</div>
              <div>请选择</div>
              <div v-on:click="complete()">完成</div>
          </div>
          <div class="arrlist">
                <ul @touchstart="_onTouchStart('province',$event)" :style="'transform: translate3d(0px, '+ provincetransY +'px, 0px);'">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li v-for="(item,index) in provincedata" :class="{active:index==provinceindex}">
                        {{item.name}}
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <ul @touchstart="_onTouchStart('city',$event)" :style="'transform: translate3d(0px, '+ citytransY +'px, 0px);'">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li v-for="(item,index) in citydata" :class="{active:index==cityindex}">
                        {{item.name}}
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <ul @touchstart="_onTouchStart('area',$event)" :style="'transform: translate3d(0px, '+ areatransY +'px, 0px);'">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li v-for="(item,index) in areadata" :class="{active:index==areaindex}">
                        {{item.name}}
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
          </div>
          <div class="linetop"></div>
          <div class="linebottom"></div>
      </div>
  </div>
</template>
<script>
import {province,city,area} from './regiondata.js'
export default {
    props: {
        provincecode: {
            type: Number,
            default: 0
        },
        citycode: {
            type: Number,
            default: 0
        },
        areacode: {
            type:Number,
            default:0
        }
    },
    data(){
        return{
            result:null,
            provincedata:[],
            citydata:[],
            areadata:[],
            provincechoosedata:{},
            citychoosedata:{},
            areachoosedata:{},
            startposition:0,
            provinceindex:0,
            cityindex:0,
            areaindex:0,
            target:'',
            provincetransY:0,
            startprovincetransY:0,
            citytransY:0,
            startcitytransY:0,
            areatransY:0,
            startareatransY:0,
            show:true
        }
    },
    mounted() {
        this.provincedata=province;
        console.log(this.provincecode);
        if(this.provincecode!=0){
            for(let i=0;i<this.provincedata.length;i++){
                if(this.provincedata[i].code==this.provincecode){
                    this.provinceindex=i;
                    this.provincechoosedata=this.provincedata[i];
                    this.provincetransY=-i*35;
                    break;
                }
            }
            this.fitercity();
            console.log(this.citycode);
            console.log(this.citydata);
            if(this.citycode!=0){
                for(let j=0;j<this.citydata.length;j++){
                    if(this.citydata[j].code==this.citycode){
                        console.log(j);
                        this.cityindex=j;
                        this.citychoosedata=this.citydata[j];
                        this.citytransY=-j*35;
                        break;
                    }
                }
                console.log(this.citytransY);
            }
            this.fiterarea();
            console.log(this.areacode);
            console.log(this.areadata);
            if(this.areacode!=0){
                for(let j=0;j<this.areadata.length;j++){
                    if(this.areadata[j].code==this.areacode){
                        console.log(j);
                        this.areaindex=j;
                        this.areachoosedata=this.areadata[j];
                        this.areatransY=-j*35;
                        break;
                    }
                }
                console.log(this.areatransY);
            }
        }else{
            this.provincechoosedata=province[0];
            this.fitercity();
            this.fiterarea();
            console.log(this.provincechoosedata);
        }
    },
    // watch: {
    //     provincechoosedata: 'fitercity',
    //     citychoosedata: 'fiterarea'
    // },
    methods:{
        _onTouchStart(target, e){
            this.target=target;
            //console.log(e);
            this.startposition=e.changedTouches[0].clientY;
            this['start'+target+'transY']=this[target+'transY'];
            console.log(this.startposition);
            document.addEventListener('touchmove', this._onTouchMove, false);
            document.addEventListener('touchend', this._onTouchEnd, false);
            document.addEventListener('mousemove', this._onTouchMove, false);
            document.addEventListener('mouseup', this._onTouchEnd, false);
        },
        _onTouchMove(e){
            //console.log(e);
            let y=e.changedTouches[0].clientY-this.startposition;
                this[this.target+'transY']=this['start'+this.target+'transY']+y;
            //}
            
        },
        _onTouchEnd(e){
            let y=e.changedTouches[0].clientY-this.startposition;
            let intery=(y/35).toFixed(0);
            console.log(intery*35);
            console.log(this['start'+this.target+'transY']);
            console.log(parseInt(this['start'+this.target+'transY']) + intery*35);
            if(this['start'+this.target+'transY']+intery*35<0){
                if(this['start'+this.target+'transY']+intery*35<-this[this.target+'data'].length*35+35){
                    this[this.target+'transY']=-this[this.target+'data'].length*35+35;
                }else{
                    this[this.target+'transY']=this['start'+this.target+'transY']+intery*35;
                }
            }else{
                this[this.target+'transY']=0;
            }
            console.log("index");
            console.log(this[this.target+'transY']/35)
            this[this.target+'index']=-parseInt(this[this.target+'transY']/35);
            this[this.target+'choosedata']=this[this.target+'data'][this[this.target+'index']];
            if(this.target=="province"){
                this.fitercity()
            }
            if(this.target=='city'){
                this.fiterarea()
            }
            document.removeEventListener('touchmove', this._onTouchMove);
            document.removeEventListener('touchend', this._onTouchEnd);
            document.removeEventListener('mousemove', this._onTouchMove);
            document.removeEventListener('mouseup', this._onTouchEnd);
        },
        fitercity(){
            let cityalldata=city;
            console.log("加载了城市选择");
            //console.log(this.provincechoosedata.code);
            var _this=this;
            this.citydata=[];
            this.cityindex=0;
            this.citytransY=0;
            console.log()
            cityalldata.forEach(function(item){
                if(item.parentId==_this.provincechoosedata.code){
                    _this.citydata.push(item);
                }
            })
            //console.log(this.citydata);
            //if(!this.citychoosedata){
            this.citychoosedata=this.citydata[0];
            //}
            console.log(this.citydata);
        },
        fiterarea(){
            let areaalldata=area;
            //console.log(area);
            var _this=this;
            this.areadata=[];
            this.areaindex=0;
            this.areatransY=0;
            console.log(_this.citychoosedata.code);
            areaalldata.forEach(function(item){
                if(item.parentId==_this.citychoosedata.code){
                    _this.areadata.push(item);
                }
            })
            console.log(this.areadata);
            //if(!this.areachoosedata){
                this.areachoosedata=this.areadata[0];
            //}
        },
        complete(){
            console.log("ok");
            this.result={
                province: this.provincechoosedata,
                city: this.citychoosedata,
                area: this.areachoosedata
            }
            this.show=false;
            this.$emit('areaResult', this.show,this.result);
            
            //console.log(this.result);
        },
        _stopDef(e){
            e.preventDefault()
        }
    }
}
</script>
<style scoped>
.regionpickbox{background-color: rgba(0,0,0,.35);position: absolute;top: 0;left: 0;right: 0;bottom: 0;}
.regionpickarea{position: fixed;height: 285px;left: 0;right: 0;bottom: 0;box-shadow: 1px 1px 1px #bbb;background: #fff;}
.title{height: 40px;background-color: #ccc;line-height: 40px;}
.title>div{width: 33.3%;float: left;color:#333;text-align: center;font-size: 16px;line-height: 40px;}
.linebottom{position: absolute;bottom: 105px;border-top:1px solid #ccc;width: 100%;}
.linetop{position: absolute;bottom: 140px;border-top:1px solid #ccc;width: 100%;}
.arrlist{height: 245px;overflow: hidden;width:100%;}
.arrlist ul{width: 33.3%;float: left}
.arrlist ul li{width: 100%;text-align: center;height: 35px;line-height: 35px;}
.active{color:green}
</style>

