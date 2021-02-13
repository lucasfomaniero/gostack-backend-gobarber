import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import EtherealMailProvider from './Implementations/EtherealMailProvider';
import SESMailProvider from './Implementations/SESMailProvider';
import IMailProvider from './Models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
