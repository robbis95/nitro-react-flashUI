import { FC } from 'react';
import { BonusRareWidgetView } from './bonus-rare/BonusRareWidgetView';
import { GetWidgetLayoutProps } from './GetWidgetLayout.types';
import { HallOfFameWidgetView } from './hall-of-fame/HallOfFameWidgetView';
import { PromoArticleWidgetView } from './promo-article/PromoArticleWidgetView';

export const GetWidgetLayout: FC<GetWidgetLayoutProps> = props =>
{
  switch (props.widgetType)
  {
    case "promoarticle":
      return <PromoArticleWidgetView />;
    case "achievementcompetition_hall_of_fame":
      return <HallOfFameWidgetView slot={props.slot} conf={props.widgetConf} />;
    case "bonusrare":
      return <BonusRareWidgetView />;
    default:
      return null;
  }
}
