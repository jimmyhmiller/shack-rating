/** @jsx React.DOM */

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}


var fb = new Firebase("https://shack-rating.firebaseio.com/")

var sum = function(array) {
    return _.reduce(array, function(sum, num) {
        return sum + num;
    });
} 


var Shacks = React.createClass({
    render: function() {
        var shacks = _.map(this.props.shacks, function(shack, id) {
            console.log(shack.title, sum(shack.ratings)/shack.ratings.length)
            var rating = Math.round(sum(shack.ratings)/shack.ratings.length);
            return (<Shack addRating={this.props.addRating} description={shack.description} title={shack.title} url={shack.url} num_ratings={shack.ratings.length} rating={rating} key={shack.id} guid={id} />)
        }.bind(this))
        return (<div>{shacks}</div>);
      }
});


var Shack = React.createClass({
    render: function() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <img src={this.props.url} alt={this.props.title} />
                <p>{this.props.description}</p>
                <Rating num_ratings={this.props.num_ratings} rating={this.props.rating} />
                <MyRating guid={this.props.guid} addRating={this.props.addRating} rating={this.props.rating} />
            </div>
        );
      }
});


var MyRating = React.createClass({
    render: function() {
        var stars = _.map(_.range(5), function(i) {
            return (<a href="#" className="rating" key={i} onClick={this.props.addRating.bind(null, this.props.guid, i)}>&#9733;</a>);
        }.bind(this))
        return (
            <div>{stars}</div>
        );
      }
});

var Rating = React.createClass({
    render: function() {
        var stars = _.map(_.range(this.props.rating), function(i) {
            return (<span className="rating" key={i}>&#9733;</span>);
        })
        return (
            <div>{stars} ({this.props.num_ratings})</div>
        );
      }
});

var Page = React.createClass({

    componentWillMount: function() {
        fb.on("value", function(data) {
            if (data.val() != null && !_.isEqual(data.val().shacks, this.state.shacks)) {
                this.setState({shacks: data.val().shacks});
            }
        }.bind(this))
    },

    addRating: function(guid, rating, e) {
        e.preventDefault();
        var shacks = this.state.shacks;
        shacks[guid].ratings.push(rating+1);
        fb.child("shacks").child(guid).set(shacks[guid]);
        this.setState({shacks: shacks});
    },

    getInitialState: function() {
        return {
            shacks: {
 
            }
        };
    },

    newShack: function(e) {
        e.preventDefault();
        var shacks = this.state.shacks;
        var id = guid()
        shacks[id] = {
            url: this.refs.url.getDOMNode().value,
            title: this.refs.title.getDOMNode().value,
            description: this.refs.description.getDOMNode().value,
            ratings: [3]
        }
        fb.child("shacks").child(id).set(shacks[id]);
        this.setState({shacks: shacks})
        e.target.reset()
    },


    render: function() {
        return (
            <div>
                <h1>Rate That Shack!!!</h1>
                <div className="col-md-5">
                    <Shacks addRating={this.addRating} shacks={this.state.shacks} />
                </div>
                <form className="col-md-5" onSubmit={this.newShack}>
                    <h3>Add an Awesome Shack!</h3>
                    <div className="form-group">
                        <div className="form-group">
                            <input className="form-control" ref="url" placeholder="http://urlfortheawesomesha.ck/shack.jpg" type="text" />
                        </div>
                        <div className="form-group">
                            <input className="form-control" ref="title" placeholder="Title for the Awesome Shack" type="text" />
                        </div>
                        <div className="form-group">
                            <textarea ref="description" className="form-control" rows="4" placeholder="Description of the Awesome Shack"></textarea>
                        </div>
                        <div className="form-group">
                            <input className="btn btn-primary pull-right" type="submit" value="Submit Awesome Shack"  />
                        </div>
                    </div>
                </form>
            </div>
        );
      }
});



React.renderComponent(
    <Page />,
    document.getElementById("root")
);
