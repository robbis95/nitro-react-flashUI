import { CatalogClubOfferData, CatalogPageOfferData, ICatalogPageData, ICatalogPageParser } from 'nitro-renderer';
import { Reducer } from 'react';
import { CatalogPetPalette } from '../utils/CatalogPetPalette';
import { ICatalogOffers, ICatalogSearchResult, SetOffersToNodes } from '../utils/CatalogUtilities';
import { SubscriptionInfo } from '../utils/SubscriptionInfo';

export interface ICatalogState
{
    root: ICatalogPageData;
    offerRoot: ICatalogOffers;
    currentTab: ICatalogPageData;
    currentPage: ICatalogPageData;
    pageParser: ICatalogPageParser;
    activeOffer: CatalogPageOfferData;
    searchResult: ICatalogSearchResult;
    petPalettes: CatalogPetPalette[];
    clubOffers: CatalogClubOfferData[];
    subscriptionInfo: SubscriptionInfo;
}

export interface ICatalogAction
{
    type: string;
    payload: {
        root?: ICatalogPageData;
        offerRoot?: ICatalogOffers;
        currentTab?: ICatalogPageData;
        currentPage?: ICatalogPageData;
        pageParser?: ICatalogPageParser;
        activeOffer?: CatalogPageOfferData;
        searchResult?: ICatalogSearchResult;
        petPalette?: CatalogPetPalette;
        clubOffers?: CatalogClubOfferData[];
        subscriptionInfo?: SubscriptionInfo;
    }
}

export class CatalogActions
{
    public static SET_CATALOG_ROOT: string = 'CA_SET_CATALOG_ROOT';
    public static SET_CATALOG_CURRENT_TAB: string = 'CA_SET_CATALOG_CURRENT_TAB';
    public static SET_CATALOG_CURRENT_PAGE: string = 'CA_SET_CATALOG_CURRENT_PAGE';
    public static SET_CATALOG_PAGE_PARSER: string = 'CA_SET_CATALOG_PAGE';
    public static SET_CATALOG_ACTIVE_OFFER: string = 'CA_SET_ACTIVE_OFFER';
    public static SET_SEARCH_RESULT: string = 'CA_SET_SEARCH_RESULT';
    public static SET_PET_PALETTE: string = 'CA_SET_PET_PALETTE';
    public static SET_CLUB_OFFERS: string = 'CA_SET_CLUB_OFFERS';
    public static SET_SUBSCRIPTION_INFO: string = 'CA_SET_SUBSCRIPTION_INFO';
    public static RESET_STATE = 'CA_RESET_STATE';
}

export const initialCatalog: ICatalogState = {
    root: null,
    offerRoot: null,
    currentTab: null,
    currentPage: null,
    pageParser: null,
    activeOffer: null,
    searchResult: null,
    petPalettes: [],
    clubOffers: null,
    subscriptionInfo: new SubscriptionInfo()
}

export const CatalogReducer: Reducer<ICatalogState, ICatalogAction> = (state, action) =>
{
    switch(action.type)
    {
        case CatalogActions.SET_CATALOG_ROOT: {
            const root = (action.payload.root || state.root || null);
            const currentTab = ((root && (root.children.length > 0) && root.children[0]) || null);

            const offerRoot: ICatalogOffers = {};

            SetOffersToNodes(offerRoot, root);

            return { ...state, root, offerRoot, currentTab };
        }
        case CatalogActions.SET_CATALOG_CURRENT_TAB: {
            const currentTab = (action.payload.currentTab || state.currentTab || null);
            const searchResult = null;

            return { ...state, currentTab, searchResult };
        }
        case CatalogActions.SET_CATALOG_CURRENT_PAGE: {
            const currentPage = (action.payload.currentPage || state.currentPage || null);

            return { ...state, currentPage };
        }
        case CatalogActions.SET_CATALOG_PAGE_PARSER: {
            let pageParser = (Object.create(action.payload.pageParser) as ICatalogPageParser);
            let activeOffer = null;

            if(pageParser.layoutCode === 'single_bundle')
            {
                activeOffer = ((pageParser.offers && pageParser.offers[0]) || null);
            }

            const searchResult = state.searchResult;

            if(searchResult)
            {
                searchResult.furniture = null;
            }

            return { ...state, pageParser, activeOffer, searchResult };
        }
        case CatalogActions.SET_CATALOG_ACTIVE_OFFER: {
            const activeOffer = (action.payload.activeOffer || state.activeOffer || null);

            return { ...state, activeOffer };
        }
        case CatalogActions.SET_SEARCH_RESULT: {
            const searchResult = (action.payload.searchResult || null);

            return { ...state, searchResult };
        }
        case CatalogActions.SET_PET_PALETTE: {
            const petPalette = (action.payload.petPalette || null);

            let petPalettes = [ ...state.petPalettes ];

            for(let i = 0; i < petPalettes.length; i++)
            {
                const palette = petPalettes[i];

                if(palette.breed === petPalette.breed)
                {
                    petPalettes.splice(i, 1);

                    break;
                }
            }

            petPalettes.push(petPalette);

            return { ...state, petPalettes };
        }
        case CatalogActions.SET_CLUB_OFFERS: {
            const clubOffers = (action.payload.clubOffers || null);

            return { ...state, clubOffers };
        }
        case CatalogActions.SET_SUBSCRIPTION_INFO: {
            const subscriptionInfo = (action.payload.subscriptionInfo || null);

            return { ...state, subscriptionInfo };
        }
        case CatalogActions.RESET_STATE: {
            return { ...initialCatalog };
        }
        default:
            return state;
    }
}