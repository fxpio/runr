/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {EditionResponse} from '@/api/models/responses/EditionResponse';
import {ICompetition} from '@/db/tables/ICompetition';
import {IEdition} from '@/db/tables/IEdition';
import {EditionState} from '@/stores/edition/EditionState';
import {Commit} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Util {
    public static async getOne(commit: Commit, state: EditionState, id: number|null,
                               findFirst: boolean = false): Promise<IEdition|null> {
        if (state.current && id && state.current.id === id) {
            return state.current;
        }

        if (state.current && id !== state.current.id) {
            commit('SELECT_CURRENT', null);
        }

        if (null === state.current) {
            if (id) {
                for (const edition of state.all) {
                    if (id === edition.id) {
                        commit('SELECT_CURRENT', edition);
                        break;
                    }
                }
            }

            if (null === state.current && findFirst) {
                commit('SELECT_CURRENT', state.all.length > 0 ? state.all[0] : null);
            }
        }

        return state.current;
    }

    public static convertEdition(edition: EditionResponse, apiKey: string): IEdition {
        const dCompetitions: ICompetition[] = [];

        for (const comp of edition.competitions) {
            dCompetitions.push({
                id: Number(comp.id),
                name: comp.name,
            } as ICompetition);
        }

        return {
            id: Number(edition.id),
            name: edition.name,
            currency: edition.currency,
            competitions: dCompetitions,
            apiKey,
        } as IEdition;
    }
}
