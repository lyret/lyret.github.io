/// <reference path="defs/ractive.d.ts" />


// Filmtipset (super simple) definition 
declare var FilmService;

// Underscore (super simple) definition
declare var _;

// Movie class
class Movie {
    Name: string
    OriginalName: string
    Director: string;
    Length: number;
    Year: string;
    ImageUrl: string;
    FilmtipsetId: string;
    FilmtipsetUrl: string; 
    ImdbId: string;
    
    // Filtering
    MatchedName:string;
    MatchedAttribute:string;
    
    // Constructor
    constructor()
    {
        
    }
}



// Search function
function UpdateFilmlist(app : Ractive.Ractive, source: any) //TODO: Strongly type filmtipset
{
    //TODO: Returns bio films right now
    var search:string = 'bio';
    console.log("searching for '" + search + "'")
    
    source.get("list", null, {'id' : search},
        function(request) {
        
            var data = request.data[0].movies;
            console.log("search done!");
            var movies = data.map(function(result)
            {
                var movie = new Movie();
                movie.Name = result.movie.name;
                movie.OriginalName = result.movie.orgname;
                movie.Director = result.movie.director;
                movie.Length = result.movie.length;
                movie.Year = result.movie.year;
                movie.ImageUrl = result.movie.image;
                movie.FilmtipsetId = result.movie.id;
                movie.FilmtipsetUrl =  result.movie.url;
                movie.ImdbId = result.movie.imdb;
                return movie;
            });
            app.set('filmList', movies);
        },
        function(error)
        {
            console.error("Filmtipset error!");
            console.log(error);
        }
    );
}



// MAIN-ISH

var service =new FilmService("Z4q7DUTh8P80TLpR8QDnKQ"); //TODO: Should not be in javascript

var app = new Ractive({
        el: "#root",
        template: "#app_template",
        data: {
            // "Data attributes"
            filmList: [],
            currentMovie: null,
            
            // "Computed Data"
            movies: function() {
                var filter = this.get('movieFilter');
                var all_films = this.get('filmList');
                
                if (!filter) {
                    return all_films;
                }
                
                filter = new RegExp(_.escapeRegExp(filter), 'i');
                
                
                return _.filter(all_films, function(movie: Movie)
                        {
                            movie.MatchedName = null;
                            movie.MatchedAttribute = null;
                            
                            var match = movie.Name.match(filter);
                            if (match) {
                                movie.MatchedName = movie.Name.replace(match.toString(), "<u>" + match.toString() + "</u>"); 
                                return true;
                            }
                            
                            var match = movie.OriginalName.match(filter);
                            if(match) {
                                movie.MatchedAttribute = "<b>Orginaltitel</b>:&nbsp;" + movie.OriginalName.replace(match.toString(), "<u>" + match.toString() + "</u>");
                                return true;
                            }
                            
                            var match = movie.Director.match(filter);
                            if(match) {
                                movie.MatchedAttribute = "<b>Regissör</b>:&nbsp;" + movie.Director.replace(match.toString(), "<u>" + match.toString() + "</u>");
                                return true;
                            }
                            
                            var match = movie.Year.match(filter);
                            if(match) {
                                movie.MatchedAttribute = "<b>År</b>:&nbsp;" + movie.Year.replace(match.toString(), "<u>" + match.toString() + "</u>");
                                return true;
                            }
                            
                            return false;
                        });
            },
        },
    });

// Method for viewing details for a movie
app.on('view-movie', function(event: any, movie: Movie) {
    this.set({
       currentMovie: movie,
    });
});

// Method for closing the detailed view
app.on('view-grid', function(event) {
    this.set({
        currentMovie: null,
    });
});


// Updat the filmList
UpdateFilmlist(app, service);



/*skillDevelopers: function(skill)
            {
                skill = skills[skill];
                
                if (!skill) {
                    return;
                }
                
                return _.map(skill.developers, function(slug) {
                    return developers[slug];
                });         
            }*/