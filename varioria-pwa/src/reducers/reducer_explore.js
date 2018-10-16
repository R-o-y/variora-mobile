import _ from 'lodash';
import {
  DOCUMENT_GET_EXPLORE,
  READLIST_GET_EXPLORE,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case DOCUMENT_GET_EXPLORE:
      const mostViewsDocuments = action.payload.data.filter(item => item.description === 'most_views');
      const mostStarsDocuments = action.payload.data.filter(item => item.description === 'most_collectors');
      const mostAnnotationsDocuments = action.payload.data.filter(item => item.description === 'most_annotations');
      return _.extend({}, state, {
        documents:
        { mostViewsDocuments: mostViewsDocuments,
          mostStarsDocuments: mostStarsDocuments,
          mostAnnotationsDocuments: mostAnnotationsDocuments,
        }
      });
    case READLIST_GET_EXPLORE:
      const mostCollectorsReadlists = action.payload.data.most_collectors_readlists;
      const newestReadlists = action.payload.data.newest_readlists;
      return _.extend({}, state, {
        readlists:
        { mostCollectorsReadlists: mostCollectorsReadlists,
          newestReadlists: newestReadlists,
        }
      });
    default:
      return state;
  }
}
