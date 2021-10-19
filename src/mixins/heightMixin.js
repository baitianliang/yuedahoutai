export default {
    created() {
        window.addEventListener('resize', this.getHeight)
    },
    destroyed(){
        window.removeEventListener('resize', this.getHeight)
    },
    data() {
        return {
            height: 630,
            class: 'team',
            subHeight: 180
        }
    },
    mounted() {
        if (!!document.getElementsByClassName('team')[0]) {
            this.class = 'team'
        }
        if (!!document.getElementsByClassName('list-main')[0]) {
            this.class = 'list-main'
        }
        if (!!document.getElementsByClassName('work-review')[0]) {
            this.class = 'work-review'
            this.subHeight = 130
        }
		// this.$nextTick(() => {
        //     this.height = this.height - document.getElementsByClassName(this.class)[0].offsetHeight
        // })
        setTimeout(() => {
            this.height = document.getElementsByClassName(this.class)[0].offsetHeight - this.subHeight
        }, 300);
    },
    methods: {
        getHeight() {
            if( !document.getElementsByClassName(this.class)[0] ) return;
            this.height = document.getElementsByClassName(this.class)[0].offsetHeight - this.subHeight;
        }
    }
};