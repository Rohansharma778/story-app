const moment =require('moment')

module.exports= {
    formatDate : function (date,format){
        return moment(date).format(format)
    },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
        let new_str = str.substr(0, len);
        new_str = new_str.substr(0, new_str.lastIndexOf(' '));
        return new_str.length > 0 ? new_str + '...' : str.substr(0, len) + '...';
    }
    return str;
},
    stripTags: function(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input.replace(/<\/?[^>]+(>|$)/g, '')
},
    editIcon: function(storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
        if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
        } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
        }
    } else {
        return '';
    }
},
select:function(selected,options){
    return options
    .fn(this)
    .replace(
        new RegExp('value="'+selected+'"'),
        '$& selected="selected"'
    )
    .replace(
        new RegExp('>'+selected+'</option>'),
        'selected="selected"$&'
    )
},
}