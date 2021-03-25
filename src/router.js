import Vue from 'vue'
import Router from 'vue-router'

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

Vue.use(Router);

const routes = [
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