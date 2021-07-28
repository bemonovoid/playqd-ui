import Vue from 'vue'
import Router from 'vue-router'

import ApplicationView from "@/components/application/ApplicationPlayerComponent";
import HomeComponent from "@/components/application/HomeComponent";
import ArtistsComponent from "@/components/application/ArtistsComponent";
import AlbumsComponent from "@/components/application/AlbumsComponent";
import AlbumComponent from "@/components/application/AlbumComponent";
import GenresComponent from "@/components/application/GenresComponent";
import SongListComponent from "@/components/application/SongListComponent";

import LibraryView from "@/components/library/library/LibraryView";
import LoginView from "@/components/account/LoginView";
import ArtistsView from "@/components/library/artists/ArtistsView";
import GenresView from "@/components/library/genres/GenresView";
import LibrarySongsView from "@/components/library/songs/LibrarySongsView.vue";
import AlbumsView from "@/components/library/albums/AlbumsView";
import AlbumSongsView from "@/components/library/songs/AlbumSongsView";
import ArtistSongsView from "@/components/library/songs/ArtistSongsView";
import PlayerView from "@/components/library/player/PlayerView";

import PreferencesView from "@/components/preferences/PreferencesView";
import LibrarySettingsView from "@/components/preferences/LibrarySettingsView";
import ArtistComponent from "@/components/application/ArtistComponent";

Vue.use(Router);

const routes = [

    { path: '/application', name: 'ApplicationView', components: { applicationRoute: ApplicationView }, meta: {title: 'Application'},
        children: [
            { path: '/application', name: 'HomeComponent', component: HomeComponent },
            { path: 'artists', name: 'ArtistsComponent', component: ArtistsComponent, props: route => ({page: route.query.page, size: route.query.size}) },
            { path: 'artists/:artistId', name: 'ArtistComponent', component: ArtistComponent },
            { path: 'albums', name: 'AlbumsComponent', component: AlbumsComponent, props: route => ({page: route.query.page, genre: route.query.genre}) },
            { path: 'albums/:albumId', name: 'AlbumComponent', component: AlbumComponent },
            { path: 'genres', name: 'GenresComponent', component: GenresComponent },
            { path: 'queue', name: 'queue', component: SongListComponent }

        ]
    },
    { path: '/', alias: ['/home', '/index.html'], name: 'Home', component: LibraryView, meta: {title: 'Home'} },
    { path: '/account/login', name: 'LoginView', component: LoginView, meta: {title: 'Login'} },
    { path: '/library', name: 'LibraryView', component: LibraryView, meta: {title: 'Library'} },
    { path: '/library/artists', name: 'ArtistsView', component: ArtistsView, meta: {title: 'Artists'} },
    { path: '/library/genres', name: 'GenresView', component: GenresView, meta: {title: 'Genres'} },
    { path: '/library/songs', name: 'LibrarySongsView', component: LibrarySongsView, meta: {title: 'Library songs'} },
    { path: '/library/albums', name: 'AlbumsView', component: AlbumsView, props: route => ({artistId: route.query.artistId, genre: route.query.genre}), meta: {title: 'Albums'} },
    { path: '/library/artists/albums/:albumId', name: 'AlbumSongsView', component: AlbumSongsView, meta: {title: 'Album songs'}, props: true },
    { path: '/library/artists/:artistId', name: 'ArtistSongsView', component: ArtistSongsView, meta: {title: 'Album songs'}, props: true },
    { path: '/library/player/:songId', name: 'PlayerView', component: PlayerView, meta: {title: 'Player'}, props: true },
    { path: '/preferences', name: 'PreferencesView', components: { preferencesRoute: PreferencesView }, meta: {title: 'Preferences'},
        children: [
                { path: 'library', name: 'LibrarySettingsView', component: LibrarySettingsView }
            ]
    },
]

const router = new Router({
    routes
});

export default router;