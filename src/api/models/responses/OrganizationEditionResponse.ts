/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CompetitionSimpleResponse} from '@/api/models/responses/CompetitionSimpleResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface OrganizationEditionResponse {
    id: number;
    name: string;
    competitions: CompetitionSimpleResponse[];
    isProd: boolean;
    apiKey: string;
    created: string;
    startDate: string;
    endDate: string;
    emailContact: string;
    phoneContact: string;
    websiteUrl: string;
}
